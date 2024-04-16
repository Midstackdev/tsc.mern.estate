import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { InputChangeEventHandler } from '../types';

type PageData = {
  picture?: string;
};

const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    'initial' | 'uploading' | 'success' | 'fail'
  >('initial');
  // const [progress, setProgress] = useState(0);
  const [pageData, setPageData] = useState<PageData>({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }

    return () => {
      // second;
    };
  }, [file]);

  const handleFileUpload = async (file: File) => {
    if (file) {
      setStatus('uploading');

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData,
          // work on progress later
          // onUploadProgress: (progressEvent) => {
          //   const percentCompleted = Math.round(
          //     (progressEvent.loaded * 100) / progressEvent.total
          //   );
          //   setProgress(percentCompleted);
          // },
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = await response.json();
        setPageData({ ...pageData, picture: data.url });
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('fail');
      }
    }
  };
  console.log('---fr----', pageData);

  const handleFileClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleSelectFIle = (e: InputChangeEventHandler) => {
    setStatus('initial');
    setFile(e.target?.files?.[0]);
  };

  const showImage = pageData?.picture
    ? pageData.picture
    : currentUser?.picture
      ? currentUser?.picture
      : './avatar.png';

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          name=""
          id=""
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleSelectFIle}
        />
        <img
          src={showImage}
          alt=""
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={handleFileClick}
        />
        <input
          placeholder="name"
          id="name"
          type="text"
          className="border p-3 rounded-lg focus:outline-none"
        />
        <input
          placeholder="email"
          id="email"
          type="email"
          className="border p-3 rounded-lg focus:outline-none"
        />
        <input
          placeholder="password"
          id="password"
          type="text"
          className="border p-3 rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          // disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {status === 'uploading' ? 'loading...' : 'Update'}
        </button>
        {/* {progress > 0 && <p>Upload Progress: {progress}%</p>} */}
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
