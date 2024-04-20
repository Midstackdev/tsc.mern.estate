import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FormEvent, InputChangeEventHandler } from '../types';
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

type PageData = {
  picture?: string;
};

const Profile = () => {
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [file, setFile] = useState<File | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    'initial' | 'uploading' | 'success' | 'fail'
  >('initial');
  // const [progress, setProgress] = useState(0);
  const [pageData, setPageData] = useState<PageData>({});
  const dispatch = useDispatch();

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
  console.log('---sts----', status);

  const handleFileClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleSelectFile = (e: InputChangeEventHandler) => {
    setStatus('initial');
    setFile(e.target?.files?.[0]);
  };

  const handleChange = (e: InputChangeEventHandler) => {
    setPageData({ ...pageData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/${currentUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify(pageData),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/${currentUser?.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw data;
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/api/auth/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw data;
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error));
    }
  };

  const showImage = pageData?.picture
    ? pageData?.picture
    : currentUser?.picture
      ? currentUser?.picture
      : './avatar.png';

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          name=""
          id=""
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleSelectFile}
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
          defaultValue={currentUser?.name}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          placeholder="email"
          id="email"
          type="email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          placeholder="password"
          id="password"
          type="password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'loading...' : 'Update'}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          create listing
        </Link>
        {/* {progress > 0 && <p>Upload Progress: {progress}%</p>} */}
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500 mt-5">{error.message}</p>}
      {/* {!error && !loading && (
        <p className="text-green-500 mt-5">Updated successfully</p>
      )} */}
    </div>
  );
};

export default Profile;
