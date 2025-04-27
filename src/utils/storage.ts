import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function getUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

export async function uploadFile(file: File, key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: key,
    Body: file,
    ContentType: file.type,
  });

  await s3Client.send(command);
  return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`;
}
