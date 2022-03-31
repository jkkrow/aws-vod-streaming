import { Fragment, useState } from 'react';

import Input from 'components/Input';
import Upload from 'components/Upload';
import { useVideoUpload } from 'hooks/upload';

const HomePage: React.FC = () => {
  const [title, setTitle] = useState('');

  const { videoInfo, uploadProgress, uploadVideo } = useVideoUpload();

  const uploadHandler = (file: File) => {
    uploadVideo(file, title);
  };

  return (
    <Fragment>
      {!videoInfo && <Input title={title} setTitle={setTitle} />}
      <Upload
        videoInfo={videoInfo}
        uploadProgress={uploadProgress}
        disabled={!title}
        onUpload={uploadHandler}
      />
    </Fragment>
  );
};

export default HomePage;
