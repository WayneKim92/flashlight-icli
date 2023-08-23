import fs from 'fs';
import path from 'path';
import chalk from "chalk";
import { isInstalledCli } from './utils';

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
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`${chalk.blue('Created folder:')} ${fullPath}`);
        } else {
            console.log(`${chalk.blue('Folder already exists:')} ${fullPath}`);
        }
    });

    // flashlight 설치 확인, 설치 안되어 있으면 설치
    const result = await isInstalledCli('flashlight');
    console.log({result})
    //curl https://get.flashlight.dev | bash

    // maestro 설치 확인, 설치 안되어 있으면 설치

    // config.json 파일 생성

    // app bundle id 입력
}