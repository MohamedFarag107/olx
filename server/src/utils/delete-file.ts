import fs from 'fs/promises';

export const UPLOAD_DIR = `${process.cwd()}/src/uploads`;

export const deleteFile = async (filename: string) => {
  try {
    await fs.unlink(`${UPLOAD_DIR}/${filename}`);
  } catch (error) {
    console.log('Error deleting file: ', filename);
  }
};
