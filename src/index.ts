#!/usr/bin/env node
import { program } from 'commander';
import { init } from './init';

program
    .name('flashlight-icli')
    .description('Interactive command line interface for flashlight')
    .version('0.1.0')

program.command('init')
    .description('init flashlight-icli')
    .action(async (_str, _options) => init());

program.command('manual')
    .description('simplest measure way')
    .action(async (_str, _options) => {
        console.log('가장 간단한 측정 방법')
    });

program.command('test')
    .description('performance and report')
    .action(async (_str, _options) => {
        console.log('가장 간단한 측정 방법')
    });

program.command('reports')
    .description('show reports')
    .action(async (_str, _options) => {
        console.log()
    });

program.parse();
