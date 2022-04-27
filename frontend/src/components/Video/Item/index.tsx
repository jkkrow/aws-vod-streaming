import { Link } from 'react-router-dom';

import { Video } from 'types/video';
import { formatTime } from 'util/format';
import './index.css';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const isConverted = video.url.split('.')[1] === 'mpd';

  return (
    <li className="video-item">
      <Link to={`/video/${video.id}`}>
        {isConverted && (
          <img
            src={`${process.env.REACT_APP_DOMAIN_CONVERTED}/${video.url.replace(
              /.[^.]+$/,
              '.0000001.jpg'
            )}`}
            alt={video.title}
          />
        )}
        <div>{video.title}</div>
        <div>{formatTime(video.duration)}</div>
      </Link>
    </li>
  );
};

export default VideoItem;
