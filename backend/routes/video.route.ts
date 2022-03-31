import { Router } from 'express';

import {
  getVideosHandler,
  initiateUploadHandler,
  processUploadHandler,
  completeUploadHandler,
  cancelUploadHandler,
} from '../controllers/video.controller';

const router = Router();

router.post('/upload', initiateUploadHandler);
router.put('/upload/:uploadId', processUploadHandler);
router.post('/upload/:uploadId', completeUploadHandler);
router.delete('/upload/:uploadId', cancelUploadHandler);

router.get('/', getVideosHandler);

export default router;
