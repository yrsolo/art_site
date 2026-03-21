import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { appConfig } from "@/server/config";

let client: S3Client | null = null;

function getS3Client() {
  if (!client) {
    client = new S3Client({
      region: appConfig.objectStorageRegion,
      endpoint: appConfig.objectStorageEndpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: appConfig.objectStorageAccessKeyId,
        secretAccessKey: appConfig.objectStorageSecretAccessKey,
      },
    });
  }

  return client;
}

async function bodyToString(body: unknown) {
  if (!body) {
    return "";
  }

  if (typeof (body as { transformToString?: () => Promise<string> }).transformToString === "function") {
    return (body as { transformToString: () => Promise<string> }).transformToString();
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body).toString("utf8");
  }

  return String(body);
}

export async function getObjectText(key: string, bucket = appConfig.objectStorageBucket) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await getS3Client().send(command);
  return bodyToString(response.Body);
}

export async function putObjectText(
  key: string,
  body: string,
  contentType = "application/json; charset=utf-8",
  bucket = appConfig.objectStorageBucket,
  acl?: "private" | "public-read",
) {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: acl,
    }),
  );
}

export async function putObjectBuffer(
  key: string,
  body: Buffer,
  contentType: string,
  acl: "private" | "public-read" = "private",
) {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: appConfig.objectStorageBucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: acl,
    }),
  );
}

export async function deleteObject(key: string) {
  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: appConfig.objectStorageBucket,
      Key: key,
    }),
  );
}
