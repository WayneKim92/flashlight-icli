import fs from "fs";
import path from 'path';
import {promisify} from 'util'
import child_process from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import shell from 'shelljs';

const accessAsync = promisify(fs.access);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const exec = promisify(child_process.exec);

export const checkInitialization = async () => {
    try {
        const rootPath = getScriptRunDirectoryPath();
        const configPath = path.join(rootPath, 'flashlight', 'config.json');

        await accessAsync(configPath);
        return true; // File exists
    } catch (error) {
        return false; // File does not exist
    }
}

export const getScriptRunDirectoryPath = () => process.cwd();

export const isInstalledCli = async (cliName) => {
    try {
        const {stdout} = await exec(`which ${cliName}`);

        if (stdout) {
            console.log(chalk.blue(`${cliName} is installed at:`) + `${stdout.trim()}`);
            return true;
        } else {
            console.log(chalk.red(`${cliName} is not installed.`));
            return false;
        }
    } catch (e) {
        console.log(chalk.red(`${cliName} is not installed.`));
        return false;
    }
};

export const isAndroidBundleIdFormat = (input: string): boolean => {
    const androidBundleIdRegex = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/;
    return androidBundleIdRegex.test(input);
}

export const selectFiles = async ({
                                      folderPath,
                                      message,
                                      type,
                                  }: {
    folderPath: string;
    message: string;
    type: 'list' | 'checkbox';
}) => {
    const files = fs.readdirSync(folderPath);

    const filteredFiles = files.filter((file) => !/\.(zip|DS_Store)/.test(file));

    const {fileNames} = await inquirer.prompt([
        {
            type: type,
            name: 'fileNames',
            message: message,
            choices: filteredFiles,
            validate:
                type === 'checkbox'
                    ? (input) => {
                        if (input === null || input === undefined) {
                            return message;
                        }
                        return true;
                    }
                    : undefined,
        },
    ]);

    return fileNames;
};

export const copyFileAsync = async (sourcePath: string, destinationPath: string) => {
    try {
        const data = await readFileAsync(sourcePath);
        await writeFileAsync(destinationPath, data);
        // console.log(chalk.green( `File copied from ${sourcePath} to:`), destinationPath);
    } catch (error) {
        console.error(chalk.red(`Error copying file: ${error.message}`));
    }
};

export const writeFile = async (destinationPath, str) => {
    try {
        const rootPath = getScriptRunDirectoryPath();
        const filePath = path.join(rootPath, destinationPath);
        await writeFileAsync(filePath, str, 'utf8');
        // console.log(chalk.green(`Wrote a file at:`), filePath);
    } catch (error) {
        console.error(chalk.red('Error write file'), error);
    }
}

export const isReactNativeCliVersion = () => {
    let version = "0.0.0";
    const versionOutput1 = shell.exec('react-native --version', {silent: true});
    const versionOutput2 = shell.exec('react-native -v', {silent: true});

    const versionOutputs = [versionOutput1, versionOutput2];

    versionOutputs.forEach((versionOutput) => {
        if (versionOutput.code === 0) {
            version = versionOutput.stdout.trim();
        }
    })

    return version;
}

export const getConfig = async () => {
    try {
        const rootPath = getScriptRunDirectoryPath();
        const data = await readFileAsync(path.join(rootPath, 'flashlight/config.json'), 'utf-8');

        return JSON.parse(data) as {
            bundleId: string;
            rnCliVersion: string;
            variant: string;
        }
    } catch (error) {
        console.error(chalk.red(`Error copying file: ${error.message}`));
    }
}

export const installRequiredTools = async () => {
    const isFlashlightInstalled = await isInstalledCli('flashlight');
    if (!isFlashlightInstalled) {
        console.log(chalk.green('Start flashlight installation'))
        shell.exec('curl https://get.flashlight.dev | bash');
    }

    const isMaestroInstalled = await isInstalledCli('maestro');
    if (!isMaestroInstalled) {
        console.log(chalk.green('Start maestro installation'))
        shell.exec('curl -Ls "https://get.maestro.mobile.dev" | bash');
    }
}

