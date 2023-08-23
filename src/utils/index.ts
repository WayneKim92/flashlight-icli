import fs from "fs";
import {promisify} from 'util'
import child_process from 'child_process';
import chalk from "chalk";
import inquirer from 'inquirer';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const exec = promisify(child_process.exec);

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
        console.log(chalk.green( `File copied from ${sourcePath} to:`), destinationPath);
    } catch (error) {
        console.error(chalk.red(`Error copying file: ${error.message}`));
    }
};
