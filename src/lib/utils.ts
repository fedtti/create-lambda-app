import {
  existsSync,
  mkdirSync,
  writeFileSync
} from 'fs';

/**
 * Make a directory in the filesystem.
 * @param {string} name - Directory name.
 */
export const MakeDirectory = (name: string): void => {
  try {
    if (!existsSync(`./${name}`)) {
      const folder = mkdirSync(`./${name}`);
      if (!!process.argv && (process.argv.includes('-v') || process.argv.includes('--verbose'))) {
        console.info(`✅ Directory './${name}' has been made.`);
      }
    } else {
      if (!!process.argv && (process.argv.includes('-v') || process.argv.includes('--verbose'))) {
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
    if (!!process.argv && (process.argv.includes('-v') || process.argv.includes('--verbose'))) {
      console.info(`✅ File '${path}' has been written.`);
    }
  } catch (error) {
    throw new Error(`❌ ${(error as Error).message}.`);
  }
};
