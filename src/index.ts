#!/usr/bin/env node
import {program} from 'commander';
import inquirer from 'inquirer';
import shell from 'shelljs';
import {init} from './init';
import {showLogo} from "./showLogo";

const features = ['measure', 'test', 'report'];

program
    .name('flashlight-icli')
    .description('Interactive command line interface for flashlight')
    .version('0.1.0')
    .action(async () => {
        showLogo();

        const {feature} = await inquirer.prompt([
            {
                type: 'list',
                name: 'feature',
                message: 'Select a feature.',
                choices: features,
            },
        ]);

        switch (feature) {
            case features[0]:
                // 음... 왜 안 되는 지 확인 필요
                shell.exec('flashlight measure');
                break;
            case features[1]:
                // feature 2 - X번 자동으로 테스트하기 'test'
                break;
            case features[2]:
                // feature 3 - report 선택해서 보기 'report'
                break;
        }
    })

program.command('init')
    .description('init flashlight-icli')
    .action(async (_str, _options) => init());

program.parse();
