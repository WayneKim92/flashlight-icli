#!/usr/bin/env node
import {program} from 'commander';
import inquirer from 'inquirer';
import {init} from './init';
import {showLogo} from "./showLogo";
import {report} from "./report";
import {test} from "./test";
import {checkInitialization, installRequiredTools} from "./utils";
import chalk from "chalk";

const features = ['test', 'report'];

program
    .name('flashlight-icli')
    .description('Interactive command line interface for flashlight')
    .version('0.1.0')
    .action(async () => {
        await installRequiredTools();

        showLogo();

        const isInitialized = await checkInitialization();
        if(!isInitialized){
            console.log(chalk.red('run: flashlight-icli init'));
            return;
        }

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
                await test();
                break;
            case features[1]:
                await report()
                break;
        }
    })

program.command('init')
    .description('init flashlight-icli')
    .action(async () => init());

program.parse();
