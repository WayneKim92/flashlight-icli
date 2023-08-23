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

program.parse();
