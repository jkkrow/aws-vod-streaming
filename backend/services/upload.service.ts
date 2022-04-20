import { s3 } from '../config/aws';

export const initiateMutlipart = async (fileType: string, key: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `videos/${key}`,
    ContentType: fileType,
  };

  return await s3.createMultipartUpload(params).promise();
};

export const processMultipart = async (
  uploadId: string,
  partCount: number,
  key: string
) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `videos/${key}`,
    UploadId: uploadId,
  };

  const presignedUrlPromises: Promise<string>[] = [];

  for (let index = 0; index < partCount; index++) {
    presignedUrlPromises.push(
      s3.getSignedUrlPromise('uploadPart', { ...params, PartNumber: index + 1 })
    );
  }

  // Get presigned urls
  const presignedUrls = await Promise.all(presignedUrlPromises);

  return presignedUrls;
};

export const completeMultipart = async (
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[],
  key: string
) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `videos/${key}`,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  };

  return await s3.completeMultipartUpload(params).promise();
};
