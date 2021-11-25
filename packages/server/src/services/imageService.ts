import * as fs from 'fs';
import * as os from 'os';
import { Readable } from 'stream';
import { uuid } from 'uuidv4';
import { Uploadable } from '../aws/s3ImageUploader';

export interface UploadedFile {
  filename: string;
  createReadStream(): Readable;
}

export interface ImageOperations {
  addImage(file): Promise<string>;
  removeImage(imageUuid: string): Promise<void>;
}

export interface DataImageService {
  uploadImage(imageUuid: string, downloadUrl: string, previewUrl?: string): Promise<void>;
  removeImage(imageUuid: string): Promise<void>;
}

export abstract class ImageService implements ImageOperations {
  constructor(protected uploader: Uploadable) {}
  public abstract addImage(file): Promise<string>;

  public abstract removeImage(imageUuid: string): Promise<void>;

  public getFileUrl(newFileName: string): string {
    return `${os.tmpdir()}/${newFileName}`;
  }

  public getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }

  public async saveImageFile(file: UploadedFile): Promise<string[]> {
    const imageUuid = uuid();
    const newFileName = `${imageUuid}.${this.getFileExtension(file.filename)}`;
    const fileUrl = this.getFileUrl(newFileName);
    const writeStream = fs.createWriteStream(fileUrl);
    const fileStream = file.createReadStream();
    const pipedStream = fileStream.pipe(writeStream);
    await new Promise<void>((resolve, reject) => {
      pipedStream.on('finish', () => {
        resolve();
      });

      pipedStream.on('error', e => {
        console.error(e);
      });
    });
    return [fileUrl, imageUuid, newFileName];
  }
}
