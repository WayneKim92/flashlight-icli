import { program } from 'commander';

program
    .name('flashlight-icli')
    .description('Interactive command line interface for flashlight')
    .version('0.1.0')

program.command('init')
    .description('init flashlight-icli')
    .action(async (str, options) => {
        // 명령어를 입력한 경로를 얻는다.

        console.log(__dirname);

        // flashlight를 위한 디렉토리 생성
        // flashlight/reports
        // flashlight/e2e
        // flashlight/e2e/sample.yaml


        // bundle id 입력
        //
    });

program.parse();
