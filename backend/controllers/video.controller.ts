import { RequestHandler } from 'express';

import { getVideos, createVideo } from '../services/video.service';
import {
  initiateMutlipart,
  processMultipart,
  completeMultipart,
} from '../services/upload.service';

export const getVideosHandler: RequestHandler = async (req, res) => {
  const videos = await getVideos();

  res.json({ videos });
};

export const createVideoHandler: RequestHandler = async (req, res) => {
  const { video } = req.body;

  await createVideo(video);

  res.status(201).json({ message: 'Video created successfully' });
};

export const initiateUploadHandler: RequestHandler = async (req, res) => {
  const { key, fileType } = req.body;

  const uploadData = await initiateMutlipart(fileType, key);

  res.json({ uploadId: uploadData.UploadId });
};

export const processUploadHandler: RequestHandler = async (req, res) => {
  const { key, partCount } = req.body;
  const { uploadId } = req.params;

  const presignedUrls = await processMultipart(uploadId, partCount, key);

  res.json({ presignedUrls });
};

export const completeUploadHandler: RequestHandler = async (req, res) => {
  const { key, parts } = req.body;
  const { uploadId } = req.params;

  const { Key } = await completeMultipart(uploadId, parts, key);

  res.status(201).json({ url: Key });
};
