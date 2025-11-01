#!/usr/bin/env node

import { Command } from 'commander';
import { input } from '@inquirer/prompts';
import {
  CopyFile,
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
  if (!!input && !!(/^[A-Za-z][A-Za-z0-9_-]*$/g.test(input))) { // Projects’ names cannot start with a digit, a hyphen, or an underscore and contain symbols different from hyphens or underscores.
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
    
    MakeDirectory(options.verbose, sanitizeProjectName('directory', projectName)); //

    CopyFile(options.verbose, './.gitignore', `./${sanitizeProjectName('directory', projectName)}/.gitignore`);
    CopyFile(options.verbose, './.nvmrc', `./${sanitizeProjectName('directory', projectName)}/.nvmrc`);

    const packageJson = {
      "name": `${sanitizeProjectName('file', projectName)}`,
      "version": "1.0.0",
      "description": "",
      "keywords": [
        "aws",
        "aws-lambda"
      ],
      "license": "",
      "author": "",
      "main": "./dist/index.js",
      "scripts": {
        "build": "tsc -b",
        "clean": "shx rm -fr ./dist/* ./node_modules/*",
        "deploy": "sls deploy",
        "postinstall": "npx husky init && shx rm .husky/pre-commit",
        "prepare": "husky",
        "start": "node ./dist/index.js"
      },
      "devDependencies": {
        "@commitlint/cli": "^20.1.0",
        "@commitlint/config-conventional": "^20.0.0",
        "@types/aws-lambda": "^8.10.145",
        "@types/node": "^24.9.1",
        "husky": "^9.1.7",
        "shx": "^0.4.0",
        "typescript": "^5.9.3"
      },
      "type": "module"
    };

    WriteFile(options.verbose, `./${sanitizeProjectName('directory', projectName)}/package.json`, JSON.stringify(packageJson, null, 2) + '\n'); //

    const serverlessYml = `# serverless.yml`;

    WriteFile(options.verbose, `./${sanitizeProjectName('directory', projectName)}/serverless.yml`, serverlessYml); //
    MakeDirectory(options.verbose, `${sanitizeProjectName('directory', projectName)}/src`); //

    process.exit(0);
  } catch (error) {
    console.error(`\n\r${(error as Error).message}`);
    process.exit(1);
  }
};

init();
