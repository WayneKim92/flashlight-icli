#!/usr/bin/env node
import { program } from 'commander';
import { init } from './init';
import {showLogo} from "./showLogo";

program
    .name('flashlight-icli')
    .description('Interactive command line interface for flashlight')
    .version('0.1.0')
    .action(() => {
        showLogo();
        // feature 1 - 수동 성능 측정

        // feature 2 - X번 자동으로 테스트하기

        // feature 3 - report 선택해서 보기
    })

program.command('init')
    .description('init flashlight-icli')
    .action(async (_str, _options) => init());

program.parse();
