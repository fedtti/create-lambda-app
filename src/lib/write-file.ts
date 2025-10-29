import { writeFile } from 'fs/promises';

export const WriteFile = async (path: string, content: string): Promise<void> => {
  try {
    await writeFile(path, content);
    console.info(`✅ `);
  } catch (error) {
    console.error(`❌ `);
    throw new Error('❌ ');
  }
};
