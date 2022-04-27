import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import VideoPlayer from 'components/Video/Player';
import { Video } from '../types/video';

const VideoPage: React.FC = () => {
  const [video, setVideo] = useState<Video | null>(null);

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const baseUrl = process.env.REACT_APP_SERVER_URL;
      const { data } = await axios.get(`${baseUrl}/videos/${id}`);

      setVideo(data.video);
    })();
  }, [id]);

  return <Fragment>{video && <VideoPlayer video={video} />}</Fragment>;
};

export default VideoPage;
