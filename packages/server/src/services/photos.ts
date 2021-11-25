import * as fs from 'fs';
import { ImageService } from './imageService';

export class PhotosService extends ImageService {
  public async addImage(file): Promise<string> {
    const [fileUrl, , newFileName] = await this.saveImageFile(file);

    try {
      return await this.uploader.upload(fileUrl, newFileName);
    } finally {
      fs.unlinkSync(fileUrl);
    }
  }

  public async removeImage(imageUuid: string): Promise<void> {
    await this.uploader.remove(imageUuid);
  }
}
