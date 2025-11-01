import { Command } from 'commander';
import {
  existsSync,
  mkdirSync,
  writeFileSync
} from 'fs';

const program: Command = new Command();

program
  .version('Create Lambda App 1.0.0', '-V, --version')
  .option('-v, --verbose', '')
  .parse(process.argv);

const options = program.opts();

/**
 * Make a directory in the filesystem.
 * @param {string} name - Directory name.
 */
export const MakeDirectory = (name: string): void => {
  try {
    if (!existsSync(`./${name}`)) {
      const folder = mkdirSync(`./${name}`);
      if (!!options.verbose) {
        console.info(`✅ Directory './${name}' has been made.`);
      }
    } else {
      if (!!options.verbose) {
        console.warn(`✅ Directory './${name}' already exist, skipping…`);
      }
    }
  } catch (error) {
    throw new Error(`❌ ${(error as Error).message}.`);
  }
};

/**
 * Write a file to the filesystem.
 * @param {string} path - File name.
 * @param {string} content - File content.
 */
export const WriteFile = (path: string, content: string): void => {
  try {
    const file = writeFileSync(path, content);
    if (!!options.verbose) {
      console.info(`✅ File '${path}' has been written.`);
    }
  } catch (error) {
    throw new Error(`❌ ${(error as Error).message}.`);
  }
};
