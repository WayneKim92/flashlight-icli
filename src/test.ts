import inquirer from 'inquirer';
import shell from 'shelljs';
import { isEmpty } from 'lodash';
import { selectFiles } from './utils';

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
    const folderPath = 'flashlight/e2e';
    const e2eScriptFileName = await selectFiles({ folderPath, message: 'Select a e2e script.', type: 'list' });

    const { reportName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'reportName',
            message: 'option) Enter a report name:',
            default: `${e2eScriptFileName.replace('.yaml', '')}-${formatDate(new Date())}`,
        },
    ]);

    const { iterationCount } = await inquirer.prompt([
        {
            type: 'input',
            name: 'iterationCount',
            message: 'option) Enter the number of performance measurements',
            default: '10',
        },
    ]);

    // 기기 연결
    const adbDevicesOutput = shell.exec('adb devices', { silent: true });
    const deviceLines = adbDevicesOutput.stdout.trim().split('\n');
    const devices = deviceLines.slice(1).map((line) => line.split('\t')[0]);

    if (isEmpty(devices)) {
        console.error('Error: There are no devices available for connection. Please connect the device.');
        shell.exit(1);
    }

    const { device } = await inquirer.prompt([
        {
            type: 'list',
            name: 'device',
            message: 'Select a device.',
            choices: devices,
        },
    ]);

    // 앱 설치
    const { shouldInstall } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'shouldInstall',
            message:
                'Would you like to install the app? (You do not need to install the app for performance testing if it is already installed on your device.)',
            default: true,
        },
    ]);
    // variant 변경
    if (shouldInstall as boolean) {
        // flag 입력 가능하게 변경
        shell.exec('react-native run-android --variant=releasestaging');
    }

    // 성능 측정 스크립트 실행
    shell.exec(
        `flashlight test --bundleId com.soomgo.debug --testCommand "maestro --device ${device} test ${folderPath}/${e2eScriptFileName}" --resultsFilePath flashlight/reports/${reportName}.json --iterationCount ${iterationCount}`,
    );

    console.log(
        `\n
성능 리포트 파일 용량이 크므로 공유가 필요한 경우, 아래 명령어로 zip 파일로 만들어서 PR로 올려주세요.
참고, https://github.com/Soomgo-Mobile/soomgo-mobile-app/pull/8620\n
$zip [zip_파일_이름].zip [리포트_파일_이름].json\n
`,
    );
};
