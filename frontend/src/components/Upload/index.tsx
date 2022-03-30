import { useVideoUpload } from 'hooks/upload';
import { formatSize, formatTime } from 'util/format';
import './index.css';

const Upload: React.FC = () => {
  const { videoInfo, uploadProgress, uploadVideo } = useVideoUpload();

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    uploadVideo(event.target.files[0]);
  };

  return (
    <div className="upload">
      {!videoInfo && (
        <label>
          <input
            hidden
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
          />
          <div>Upload Video</div>
        </label>
      )}
      {videoInfo && (
        <div className="video-info">
          <div>
            <span>Filename:</span>
            <span>{videoInfo.fileName}</span>
          </div>
          <div>
            <span>Filesize:</span>
            <span>{formatSize(videoInfo.fileSize)}</span>
          </div>
          <div>
            <span>Duration:</span>
            <span>{formatTime(videoInfo.duration)}</span>
          </div>
          <div className="upload-progress">
            <div className="upload-progress__background" />
            <div
              className="upload-progress__current"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
