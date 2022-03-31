import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const s3 = new AWS.S3({
  region: process.env.AWS_S3_BUCKET_REGION!,
});

export const dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_DB_TABLE_REGION!,
});
