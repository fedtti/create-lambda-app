#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import { 
  MakeDirectory,
  WriteFile
} from './lib/utils.js';

const program: Command = new Command();

program
  .version('Create Lambda App 1.0.0', '-V, --version')
  .option('-v, --verbose', '')
  .parse(process.argv);

const options = program.opts(); // List of specified arguments.

/**
 * Check whether the input is valid or not.
 * @param {string} input - The project name.
 * @returns {boolean}
 */
const validateProjectName = (input: string): boolean => {
  if (!!input && !(/^\d|\s/g.test(input))) { // Projects’ names cannot start with a digit and spaces are not allowed.
    return true;
  } else {
    return false;
  }
};

/**
 * Sanitize the input to use it in a filesystem.
 * @param {string} input - The project name.
 * @returns {string}
 */
const sanitizeProjectName = (scope: string = 'file', input: string): string => {
  input = (scope === 'directory') ? input.replace('-', '_').toLowerCase() : input.toLowerCase();
  return input;
};

/**
 * 
 */
const init = async (): Promise<void> => {
  try {
    const projectName = await input({
      message: 'Project Name:',
      validate: validateProjectName
    });
    
    MakeDirectory(options.verbose, sanitizeProjectName('directory', projectName));
    WriteFile(options.verbose, `./${sanitizeProjectName('directory', projectName)}/serverless.yml`, ''); // TODO: @fedtti - Add configuration content.
    
    MakeDirectory(options.verbose, `${sanitizeProjectName('directory', projectName)}/src`);
    process.exit(0);
  } catch (error) {
    console.error(`\n\r${(error as Error).message}`);
    process.exit(1);
  }
};

init();
