const path = require('path');
const fs = require('fs');

const { updateJobSettings, createJob } = require('./lib/job');

exports.handler = async (event) => {
  console.log(event);

  const { MEDIA_CONVERT_ROLE, MEDIA_CONVERT_ENDPOINT, DESTINATION_BUCKET } =
    process.env;

  /**
   * Define inputs/ouputs, metadata.
   */
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key).replace(
    /\+/g,
    ' '
  );
  const srcBucket = decodeURIComponent(event.Records[0].s3.bucket.name);

  const { dir, name } = path.parse(srcKey);
  const inputPath = `s3://${srcBucket}/${srcKey}`;
  const outputPath = `s3://${DESTINATION_BUCKET}/${dir}/`;

  const jobMetadata = {};

  jobMetadata['id'] = name;
  jobMetadata['key'] = srcKey;

  let job;

  /**
   * Get job settings
   */
  job = JSON.parse(fs.readFileSync('jobs/video.json'));

  const thumbnailJob = JSON.parse(fs.readFileSync('jobs/thumbnail.json'));

  job.Settings.OutputGroups.push(thumbnailJob);

  /**
   * Parse settings file to update source / destination
   */
  job = await updateJobSettings(
    job,
    inputPath,
    outputPath,
    jobMetadata,
    MEDIA_CONVERT_ROLE
  );

  /**
   * Submit Job
   */
  await createJob(job, MEDIA_CONVERT_ENDPOINT);

  return;
};
