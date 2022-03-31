import { RequestHandler } from 'express';

import { getVideos, createVideo } from '../services/video.service';
import {
  initiateMutlipart,
  processMultipart,
  completeMultipart,
  cancelMultipart,
} from '../services/upload.service';

export const getVideosHandler: RequestHandler = async (req, res) => {
  const videos = await getVideos();

  res.json({ videos });
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
  const { key, parts, video } = req.body;
  const { uploadId } = req.params;

  const { Key } = await completeMultipart(uploadId, parts, key);
  await createVideo({ ...video, url: Key });

  res.status(201).json({ message: 'Video uploaded successfully!' });
};

export const cancelUploadHandler: RequestHandler = async (req, res) => {
  const { key } = req.query;
  const { uploadId } = req.params;

  await cancelMultipart(uploadId, key as string);

  res.json({ message: 'Video upload cancelled' });
};
