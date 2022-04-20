import { useCallback, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const useVideoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<{
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    duration: number;
  } | null>(null);

  const progressArray = useRef<number[]>([]);

  const generateVideoInfo = useCallback(async (file: File, title: string) => {
    const videoDuration = await new Promise<number>((resolve) => {
      const video = document.createElement('video');

      video.onloadedmetadata = () => resolve(video.duration);
      video.src = URL.createObjectURL(file);
    });

    const videoInfo = {
      id: uuidv4(),
      title,
      fileName: file.name,
      fileSize: file.size,
      duration: videoDuration,
    };

    setVideoInfo(videoInfo);
    return videoInfo;
  }, []);

  const uploadProgressHandler = useCallback((index: number, count: number) => {
    return (event: ProgressEvent) => {
      if (event.loaded >= event.total) return;

      const currentProgress = Math.round(event.loaded * 100) / event.total;
      progressArray.current[index - 1] = currentProgress;
      const sum = progressArray.current.reduce((acc, cur) => acc + cur);
      const totalProgress = Math.round(sum / count);

      setUploadProgress(totalProgress);
    };
  }, []);

  const uploadVideo = useCallback(
    async (file: File, title: string) => {
      /**
       * Create Video Info
       */

      const videoInfo = await generateVideoInfo(file, title);

      /**
       * Initiate Multipart Upload
       */

      const key = `${videoInfo.id}.${file.type.split('/')[1]}`;
      const baseUrl = process.env.REACT_APP_SERVER_URL;
      const initiateResponse = await axios.post(`${baseUrl}/videos/upload`, {
        key,
        fileType: file.type,
      });

      const { uploadId } = initiateResponse.data;

      /**
       * Upload Parts
       */

      const partSize = 10 * 1024 * 1024; // 10MB
      const partCount = Math.floor(file.size / partSize) + 1;

      // get presigned urls for each parts
      const getUrlResponse = await axios.put(
        `${baseUrl}/videos/upload/${uploadId}`,
        {
          key,
          partCount,
        }
      );

      const { presignedUrls } = getUrlResponse.data;
      const uploadPartPromises: Promise<AxiosResponse>[] = [];

      presignedUrls.forEach((presignedUrl: string, index: number) => {
        const partNumber = index + 1;
        const start = index * partSize;
        const end = partNumber * partSize;
        const blob =
          partNumber < partCount ? file.slice(start, end) : file.slice(start);

        const uploadPartPromise = axios.put(presignedUrl, blob, {
          onUploadProgress: uploadProgressHandler(partNumber, partCount),
          headers: { 'Content-Type': file.type },
        });

        uploadPartPromises.push(uploadPartPromise);
      });

      // upload parts to aws s3
      const uploadPartResponses = await Promise.all(uploadPartPromises);
      const uploadParts = uploadPartResponses.map(
        (uploadPartResponse, index) => ({
          ETag: uploadPartResponse.headers.etag,
          PartNumber: index + 1,
        })
      );

      /**
       * Complete Multipart Upload
       */

      const completeResponse = await axios.post(
        `${baseUrl}/videos/upload/${uploadId}`,
        {
          key,
          parts: uploadParts,
        }
      );

      const { url } = completeResponse.data;

      await axios.post(`${baseUrl}/videos`, {
        video: { ...videoInfo, url },
      });

      setUploadProgress(100);
    },
    [generateVideoInfo, uploadProgressHandler]
  );

  return { videoInfo, uploadProgress, uploadVideo };
};
