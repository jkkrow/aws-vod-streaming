import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import videoRoute from './routes/video.route';

const PORT = 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/videos', videoRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
