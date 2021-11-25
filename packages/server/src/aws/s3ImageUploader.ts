import AWS from 'aws-sdk';
// tslint:disable-next-line:no-submodule-imports
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import fs from 'fs';
import SendData = ManagedUpload.SendData;
import internal from 'stream';

export interface Uploadable {
  upload(fileUrl: string, fileName: string, bucketRoot?: string): Promise<string>;
  remove(imageUuid: string, bucketRoot?: string): Promise<void>;
  download(fileName: string, bucketRoot?: string): internal.Readable;
}

const s3 = new AWS.S3();

export class S3ImageUploader implements Uploadable {
  constructor(private prefix: string) {}

  public async upload(fileUrl: string, fileName: string, bucketRoot = 'assets'): Promise<string> {
    const fileContent = fs.readFileSync(fileUrl);
    const Key = `images/${this.prefix}/${fileName}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${bucketRoot}/${Key}`,
      Body: fileContent
    };

    const uploadPromise = new Promise<SendData>((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
          throw new Error(`upload error ${err.message}`);
        } else {
          resolve(data);
        }
      });
    });
    const sendData: SendData = await uploadPromise;
    if (sendData.Location) {
      return `${process.env.AWS_CLOUDFRONT_ASSET_URL}/${Key}`;
    }
  }

  public download(fileName: string, bucketRoot = 'assets') {
    const Key = `images/${this.prefix}/${fileName}`;
    const options = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${bucketRoot}/${Key}`
    };

    return s3.getObject(options).createReadStream();
  }

  public async remove(imageUuid: string, bucketRoot = 'assets'): Promise<void> {
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: `${bucketRoot}/images/${this.prefix}/${imageUuid}`
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) {
      return;
    }

    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) {
      await this.remove(imageUuid);
    }
  }
}
