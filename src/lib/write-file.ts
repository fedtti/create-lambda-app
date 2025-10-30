import { writeFile } from 'fs/promises';

export const WriteFile = async (path: string, content: string): Promise<void> => {
  try {
    const file = await writeFile(path, content);
    console.info(`✅ File written.`);
  } catch (error) {
    console.error(`❌ ${(error as Error).message}`);
    throw new Error('❌ Unable to write the file.');
  }
};
