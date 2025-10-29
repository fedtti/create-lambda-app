#!/usr/bin/env node

import chalk from 'chalk';
import {
  WriteFile
} from './lib/write-file.js';

const init = async (): Promise<void> => {
  try {
    await WriteFile('serverless.yml', ''); // 
  } catch (error) {
    console.error(chalk.red.bold(`\n\r${(error as Error).message}`));
    process.exit(1);
  }
};

init();
