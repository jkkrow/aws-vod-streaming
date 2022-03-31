import { formatSize, formatTime } from 'util/format';
import './index.css';

interface UploadProps {
  videoInfo: {
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    duration: number;
  } | null;
  uploadProgress: number;
  disabled: boolean;
  onUpload: (file: File) => void;
}

const Upload: React.FC<UploadProps> = ({
  videoInfo,
  uploadProgress,
  disabled,
  onUpload,
}) => {
  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    onUpload(event.target.files[0]);
  };

  return (
    <div className={`upload${disabled ? ' disabled' : ''}`}>
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
            <span>Title:</span>
            <span>{videoInfo.title}</span>
          </div>
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
          {uploadProgress === 100 && (
            <p className="upload-message">Video uploaded successfully!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
