import inquirer from 'inquirer';
import shell from 'shelljs';
import semver from 'semver';
import {getConfig, getScriptRunDirectoryPath, selectFiles} from './utils';
import path from "path";

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

export const test = async () => {
    const rootPath = getScriptRunDirectoryPath();
    const e2eFolderPath = path.join(rootPath, 'flashlight/e2e');
    const reportsFolderPath = path.join(rootPath, 'flashlight/reports');
    const e2eScriptFileName = await selectFiles({folderPath:e2eFolderPath, message: 'Select a e2e script.', type: 'list'});

    const {reportName} = await inquirer.prompt([
        {
            type: 'input',
            name: 'reportName',
            message: 'option) Enter a report name:',
            default: `${e2eScriptFileName.replace('.yaml', '')}-${formatDate(new Date())}`,
        },
    ]);

    const {iterationCount} = await inquirer.prompt([
        {
            type: 'input',
            name: 'iterationCount',
            message: 'option) Enter the number of performance measurements',
            default: '10',
        },
    ]);

    const adbDevicesOutput = shell.exec('adb devices', {silent: true});
    const deviceLines = adbDevicesOutput.stdout.trim().split('\n');
    const devices = deviceLines.slice(1).map((line) => line.split('\t')[0]);

    if (devices.length === 0) {
        console.error('Error: There are no devices available for connection. Please connect the device.');
        shell.exit(1);
    }

    const {device} = await inquirer.prompt([
        {
            type: 'list',
            name: 'device',
            message: 'Select a device.',
            choices: devices,
        },
    ]);

    const {shouldInstall} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'shouldInstall',
            message:
                'Would you like to install the app? (You do not need to install the app for performance testing if it is already installed on your device.)',
            default: true,
        },
    ]);
    if (shouldInstall as boolean) {
        const config = await getConfig();

        // react-native@0.71.0 부터 rn-cli 버전이 10.0.0 이상이다.
        const variantFlagName = semver.compare(config.rnCliVersion, '10.0.0') >= 0 ? 'mode' : 'variant';
        console.log({variantFlagName});
        shell.exec(`react-native run-android --${variantFlagName}=${config.variant}`);
    }

    // 성능 측정 스크립트 실행
    shell.exec(
        `flashlight test --bundleId com.soomgo.debug --testCommand "maestro --device ${device} test ${e2eFolderPath}/${e2eScriptFileName}" --resultsFilePath ${reportsFolderPath}/${reportName}.json --iterationCount ${iterationCount}`,
    );

    console.log(
        `\n
성능 리포트 파일 용량이 크므로 공유가 필요한 경우, 아래 명령어로 zip 파일로 만들어서 PR로 올려주세요.
참고, https://github.com/Soomgo-Mobile/soomgo-mobile-app/pull/8620\n
$zip [zip_파일_이름].zip [리포트_파일_이름].json\n
`,
    );
};
