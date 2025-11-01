#!/usr/bin/env node

import { Command } from 'commander';
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
  if (!!input && !!(/^[A-Za-z][A-Za-z0-9_-]*$/g.test(input))) { // Projects name cannot start with either a digit or a hyphen and contain symbols different from hyphens or underscores.
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

    const packageJson = {
      name: projectName,
      version: "1.0.0",
      description: "",
      keywords: [],
      license: "",
      author: "",
      main: "./dist/index.js",
      scripts: {
        build: "tsc -b",
        clean: "shx rm -fr ./dist/* ./node_modules/*",
        deploy: "sls deploy",
        postinstall: "npx husky init && shx rm .husky/pre-commit",
        prepare: "husky",
        start: "node ./dist/index.js"
      },
      type: "module"
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
