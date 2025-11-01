import {
  existsSync,
  mkdirSync,
  writeFileSync
} from 'fs';

/**
 * Make a directory in the filesystem.
 * @param {boolean} verbose - If `true`, log level is set as verbose.
 * @param {string} name - Directory name.
 */
export const MakeDirectory = (verbose: boolean = false, name: string): void => {
  try {
    if (!existsSync(`./${name}`)) {
      const folder = mkdirSync(`./${name}`);
      if (!!verbose) {
        console.info(`✅ Directory './${name}' has been made.`);
      }
    } else {
      if (!!verbose) {
        console.warn(`✅ Directory './${name}' already exist, skipping…`);
      }
    }
  } catch (error) {
    throw new Error(`❌ ${(error as Error).message}.`);
  }
};

/**
 * Write a file to the filesystem.
 * @param {boolean} verbose - If `true`, log level is set as verbose.
 * @param {string} path - File name.
 * @param {string} content - File content.
 */
export const WriteFile = (verbose: boolean = false, path: string, content: string): void => {
  try {
    const file = writeFileSync(path, content);
    if (!!verbose) {
      console.info(`✅ File '${path}' has been written.`);
    }
  } catch (error) {
    throw new Error(`❌ ${(error as Error).message}.`);
  }
};
