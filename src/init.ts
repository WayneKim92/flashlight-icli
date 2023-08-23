import fs from 'fs';
import path from 'path';
import chalk from "chalk";
import shell from 'shelljs'
import {isInstalledCli} from './utils';

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

    // config.json 파일 생성

    // app bundle id 입력
}
