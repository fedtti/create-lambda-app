#!/usr/bin/env node

import { Command } from 'commander';
import { input, select } from '@inquirer/prompts';
import {
  CopyFile,
  Execute,
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
const validateInput = (input: string): boolean => {
  return (!!input && !!(/^[A-Za-z][A-Za-z0-9_-]*$/g.test(input))) ? true : false; // TODO: @fedtti - Improve validation.
};

/**
 * Sanitize the input to use it in a filesystem.
 * @param {string} input - The project name.
 * @returns {string}
 */
const sanitizeInput = (scope: string = 'file', input: string): string => {
  return (scope === 'directory') ? input.replace('-', '_').toLowerCase() : input.toLowerCase();
};

/**
 * 
 */
const init = async (): Promise<void> => {
  try {
    const organization = await input({
      message: 'Organization:',
      validate: validateInput
    });

    const name = await input({
      message: 'Name:',
      validate: validateInput
    });

    const directory: string = sanitizeInput('directory', name);

    MakeDirectory(options.verbose, directory); //
    CopyFile(options.verbose, './.nvmrc', `./${directory}/.nvmrc`); // 
    MakeDirectory(options.verbose, `${directory}/src`); //

    /**
     * Initialize and configure Git.
     */
    Execute(options.verbose, `cd ./${directory}/ && git init`);
    CopyFile(options.verbose, './.gitignore', `./${directory}/.gitignore`);

    /**
     * Initialize and configure npm.
     */
    Execute(options.verbose, `cd ./${directory}/ && npm init -y`);

    const file: string = sanitizeInput('file', name);

    const description = await input({
      message: 'Description:'
    });

    const license = await select({
      message: 'License:',
      choices: [
        {
          "name": "UNLICENSED",
          "value": "UNLICENSED"
        },
        {
          "name": "MIT",
          "value": "MIT"
        }
      ]
    });

    const author = await input({
      message: 'Author:'
    });

    const packageJson = {
      "name": `${!!organization ? '@' + organization + '/' : ''}${file}`,
      "version": "1.0.0-alpha",
      "description": `${description}`,
      "keywords": [
        "aws",
        "aws-lambda"
      ],
      "license": `${license}`,
      "author": `${author}`,
      "main": "./dist/index.js",
      "scripts": {
        "build": "tsc -b",
        "clean": "shx rm -fr ./dist/* ./node_modules/*",
        "deploy": "sls deploy",
        "postinstall": "npx husky init && shx rm .husky/pre-commit",
        "prepare": "husky",
        "start": "node ./dist/index.js"
      },
      "devDependencies": {},
      "dependencies": {},
      "type": "module"
    };

    WriteFile(options.verbose, `./${directory}/package.json`, JSON.stringify(packageJson, null, 2) + '\n');

    const devDependencies: string[] = [
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@types/aws-lambda',
      '@types/node',
      'husky',
      'shx',
      'typescript'
    ];

    const dependencies: string[] = [
      'serverless-http'
    ];

    Execute(options.verbose, `cd ./${directory}/ && npm i --save-dev ${devDependencies.join(' ')} && npm i --save ${dependencies.join(' ')} && npm i`);

    CopyFile(options.verbose, './.husky/commit-msg', `./${directory}/.husky/commit-msg`);
    CopyFile(options.verbose, './commitlint.config.ts', `./${directory}/commitlint.config.ts`);

    /**
     * Configure Serverless.
     */

    // TODO: @fedtti - Ask for Serverless options.

    const serverlessYml = `# serverless.yml\n\n`;

    WriteFile(options.verbose, `./${directory}/serverless.yml`, serverlessYml);

    /**
     * Configure TypeScript.
     */

    // TODO: @fedtti - Ask for TypeScript options.

    process.exit(0);
  } catch (error) {
    console.error(`\n\r${(error as Error).message}`);
    process.exit(1);
  }
};

init();
