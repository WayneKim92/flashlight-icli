import fs from 'fs';
import path from 'path';
import chalk from "chalk";
import shell from 'shelljs'
import inquirer from 'inquirer';
import {isInstalledCli, isAndroidBundleIdFormat} from './utils';

export const init = async () => {
    const currentWorkingDirectory = process.cwd();
    console.log(`${chalk.blue('Current working directory:')} ${currentWorkingDirectory}`);

    const foldersToCreate = [
        'flashlight/reports',
        'flashlight/e2e'
    ];

    foldersToCreate.forEach(folderPath => {
        const fullPath = path.join(__dirname, folderPath);

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true});
            console.log(`${chalk.blue('Created folder:')} ${fullPath}`);
        } else {
            console.log(`${chalk.blue('Folder already exists:')} ${fullPath}`);
        }
    });

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

    const { bundleId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'bundleId',
            message: 'Enter a android app\'s bundle id (ex: com.xxx.xxx):',
            validate: (input) => {
                if (isAndroidBundleIdFormat(input)) {
                    return true;
                } else {
                    return 'Invalid Android Bundle ID format. Please enter a valid ID.';
                }
            },
        },
    ]);

    const configStr = JSON.stringify({ bundleId });
    const configPath = path.join(__dirname, 'flashlight','config.json');
    fs.writeFile(configPath, configStr, 'utf8', (err) => {
        if (err) {
            console.error(chalk.red('Error saving config.json file:'), err);
        } else {
            console.log(chalk.green(`Saved to config.json at:`), configPath);
        }
    });
}
