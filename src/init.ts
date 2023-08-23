import fs from 'fs';
import path from 'path';
import chalk from "chalk";
import shell from 'shelljs'
import inquirer from 'inquirer';
import {isInstalledCli, isAndroidBundleIdFormat, getScriptRunDirectoryPath, copyFileAsync, writeFile} from './utils';

export const init = async () => {
    const rootPath = getScriptRunDirectoryPath();
    console.log(`${chalk.blue('Current working directory:')} ${rootPath}`);

    const foldersToCreate = [
        'flashlight/reports',
        'flashlight/e2e'
    ];
    foldersToCreate.forEach(folderPath => {
        const fullPath = path.join(rootPath, folderPath);

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
    const configPath = path.join('flashlight','config.json');
    await writeFile(configPath, configStr)

    const sampleE2ESample = `
appId: ${bundleId}
---
- launchApp
- swipe:
    direction: UP
    duration: 100
- swipe:
    direction: UP
    duration: 100
- swipe:
    direction: UP
    duration: 100
- swipe:
    direction: DOWN
    duration: 200
- swipe:
    direction: DOWN
    duration: 150
`
    await writeFile(path.join('flashlight','e2e', 'sample-e2e.yaml'), sampleE2ESample);

    const sampleReportPath = path.join(__dirname, '..', 'samples', 'sample-report.json');
    const copiedSampleReportPath = path.join(rootPath, 'flashlight','reports','sample-report.json');
    await copyFileAsync(sampleReportPath, copiedSampleReportPath)
    console.log(chalk.blue('Copied samples at:'), path.join(rootPath,'flashlight'));
}
