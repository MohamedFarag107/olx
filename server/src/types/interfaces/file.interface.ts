import { FileType } from "../enums";

export interface File {
  originalname: string;
  filename: string;
  type: FileType;
  size: number;

  // if type is image
  encoding?: string;
}