import { dynamoClient } from '../config/aws';

interface Video {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  duration: number;
  url: string;
}

const TABLE_NAME = process.env.AWS_DB_TABLE_NAME!;

export const getVideos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  return await dynamoClient.scan(params).promise();
};

export const createVideo = async (video: Video) => {
  const params = {
    TableName: TABLE_NAME,
    Item: video,
  };

  return await dynamoClient.put(params).promise();
};
