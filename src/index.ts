#!/usr/bin/env node

import { Command } from 'commander';
import { input } from '@inquirer/prompts';
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

    const directory: string = sanitizeProjectName('directory', projectName);
    
    MakeDirectory(options.verbose, directory); //
    CopyFile(options.verbose, './.nvmrc', `./${directory}/.nvmrc`); // 
    MakeDirectory(options.verbose, `${directory}/src`); //

    /**
     * Initialize, configure, and customize Git.
     */
    Execute(options.verbose, `cd ./${directory}/ && git init`);
    CopyFile(options.verbose, './.gitignore', `./${directory}/.gitignore`);

    /**
     * Initialize, configure, and customize NPM.
     */
    Execute(options.verbose, `cd ./${directory}/ && npm init -y`);

    const file: string = sanitizeProjectName('file', projectName);

    const packageJson = {
      "name": `${file}`,
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

    Execute(options.verbose, `cd ./${directory}/ && npm i --save-dev ${devDependencies.join(' ')} && npm i --save ${dependencies.join(' ')}`);

    /**
     * Initialize, configure, and customize Serverless.
     */
    const serverlessYml = `# serverless.yml`;

    WriteFile(options.verbose, `./${directory}/serverless.yml`, serverlessYml);

    /**
     * Initialize, configure, and customize TypeScript.
     */
    Execute(options.verbose, `cd ./${directory}/ && npx tsc --init`);

    process.exit(0);
  } catch (error) {
    console.error(`\n\r${(error as Error).message}`);
    process.exit(1);
  }
};

init();
