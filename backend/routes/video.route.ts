import { Router } from 'express';

import {
  getVideoHandler,
  getVideosHandler,
  createVideoHandler,
  initiateUploadHandler,
  processUploadHandler,
  completeUploadHandler,
} from '../controllers/video.controller';

const router = Router();

router.post('/upload', initiateUploadHandler);
router.put('/upload/:uploadId', processUploadHandler);
router.post('/upload/:uploadId', completeUploadHandler);

router.get('/:id', getVideoHandler);

router.get('/', getVideosHandler);
router.post('/', createVideoHandler);

export default router;
