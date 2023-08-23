#!/usr/bin/env node
import {program} from 'commander';
import inquirer from 'inquirer';
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
                name: 'mode',
                message: 'Select a feature.',
                choices: features,
            },
        ]);

        switch (feature) {
            case features[0]:
                // feature 1 - 수동 성능 측정 'measure'
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
