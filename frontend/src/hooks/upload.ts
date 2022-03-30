import { useCallback, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const useVideoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<{
    fileName: string;
    fileSize: number;
    duration: number;
    url: string;
  } | null>(null);

  const progressArray = useRef<number[]>([]);

  const generateVideoInfo = useCallback(async (file: File) => {
    const videoDuration = await new Promise<number>((resolve) => {
      const video = document.createElement('video');

      video.onloadedmetadata = () => resolve(video.duration);
      video.src = URL.createObjectURL(file);
    });

    setVideoInfo({
      fileName: file.name,
      fileSize: file.size,
      duration: videoDuration,
      url: '',
    });
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
    async (file: File) => {
      /**
       * Get Video Info
       */

      await generateVideoInfo(file);

      /**
       * Initiate Multipart Upload
       */

      const key = `${uuidv4()}.${file.type.split('/')[1]}`;
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

      setUploadProgress(100);
      setVideoInfo((state) => ({ ...state!, url }));
    },
    [generateVideoInfo, uploadProgressHandler]
  );

  return { videoInfo, uploadProgress, uploadVideo };
};
