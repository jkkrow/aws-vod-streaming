import { Video } from 'types/video';
import './index.css';
import 'shaka-player-react/dist/controls.css';

const ShakaPlayer = require('shaka-player-react');

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const isConverted = video.url.split('.')[1] === 'mpd';
  const src = isConverted
    ? `${process.env.REACT_APP_DOMAIN_CONVERTED}/${video.url}`
    : `${process.env.REACT_APP_DOMAIN_SOURCE}/${video.url}`;

  return (
    <div className="video-player">
      <h3>{video.title}</h3>
      <ShakaPlayer src={src} autoPlay />
    </div>
  );
};

export default VideoPlayer;
