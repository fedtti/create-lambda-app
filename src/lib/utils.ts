import {
  //copyFileSync,
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
        console.info(`✅ Directory './${name}' has been successfully made.`);
      }
    } else {
      console.warn(`⚠️ Directory './${name}' already exist, skipping…`);
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
      console.info(`✅ File '${path}' has been successfully written.`);
    }
  } catch (error) {
    throw new Error(`❌ ${(error as Error).message}.`);
  }
};

// export const CopyFile = (verbose: boolean = false, source: string, destination: string): void => {
//   try {
//     const file = copyFileSync(source, destination);
//     if (!!verbose) {
//       console.info(`✅ File has been successfully copied from '${source}' to '${destination}'.`);
//     }
//   } catch (error) {
//     throw new Error(`❌ ${(error as Error).message}.`);
//   }
// };
