import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import VideoList from 'components/Video/List';
import { Video } from '../types/video';

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    (async () => {
      const baseUrl = process.env.REACT_APP_SERVER_URL;
      const { data } = await axios.get(`${baseUrl}/videos`);

      setVideos(data.videos);
    })();
  }, []);

  return (
    <Fragment>
      <VideoList videos={videos} />
    </Fragment>
  );
};

export default VideosPage;
