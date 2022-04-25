const AWS = require('aws-sdk');

const dynamoClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(event);

  const { TABLE_NAME } = process.env;
  const { id, key } = event.detail.userMetadata;

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set #url = :url',
    ExpressionAttributeNames: { '#url': 'url' },
    ExpressionAttributeValues: { ':url': key.replace(/.[^.]+$/, '.mpd') },
  };

  await dynamoClient.update(params).promise();
};
