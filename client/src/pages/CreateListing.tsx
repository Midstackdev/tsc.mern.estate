import { useState } from 'react';
import {
  AppError,
  FormEvent,
  InputChangeEventHandler,
  TextareaChangeEventHandler,
} from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { User } from '../redux/user/userSlice';

type ImageUrl = { fileId: string; publicId: string; url: string };
type PageData = {
  imageUrls: ImageUrl[];
  name: string;
  description: string;
  address: string;
  type: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  offer: boolean;
};

type IUser = Pick<User, 'email' | 'name'> & { _id: string };
export type IListing = PageData & {
  _id: string;
  imageUrls: string[];
  userRef?: IUser;
};

const INITIAL_STATE = {
  imageUrls: [],
  name: '',
  description: '',
  address: '',
  type: 'rent',
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 0,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
};

const CreateListing = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  //   const [status, setStatus] = useState<
  //     'initial' | 'uploading' | 'success' | 'fail'
  //   >('initial');
  const [pageData, setPageData] = useState<PageData>(INITIAL_STATE);
  const [error, setError] = useState<AppError | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSelectFiles = (e: InputChangeEventHandler) => {
    setFiles(e.target.files);
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const imageId = pageData.imageUrls.find((_, i) => i === index)?.publicId;
      await fetch(`/api/listing/image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      setPageData({
        ...pageData,
        imageUrls: pageData.imageUrls.filter((_, i) => i !== index),
      });
    } catch (error) {
      console.log('error from removing image ' + error);
    }
  };

  const handleUploadFiles = async () => {
    setUploading(true);
    const criteria =
      files !== null &&
      files.length > 0 &&
      files.length + pageData.imageUrls.length < 7;
    if (!criteria) {
      setError({
        message: 'you can only upload 6 images per listing',
        type: 'error',
      });
      setUploading(false);
      return;
    }
    const promises = [];
    for (const file of files) {
      promises.push(sotreImage(file));
    }
    try {
      const results = await Promise.all(promises);
      console.log('----fff---', results);
      setPageData({
        ...pageData,
        imageUrls: pageData.imageUrls.concat(results),
      });
      setUploading(false);
    } catch (err) {
      setError(err as AppError);
      setUploading(false);
      console.log(err);
    }
  };

  const sotreImage = async (file: File): Promise<ImageUrl> => {
    return new Promise((resolve, reject) => {
      if (file) {
        // setStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);
        const fetchData = async () => {
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

          const data = await response.json();
          if (!response.ok) {
            // setStatus('fail');
            reject(data);
          }

          //   setStatus('success');
          resolve(data);
        };
        fetchData();
      }
    });
  };

  const handleChange = (
    e: InputChangeEventHandler & TextareaChangeEventHandler
  ) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setPageData({ ...pageData, type: e.target.id });
    }
    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setPageData({ ...pageData, [e.target.id]: e.target.checked });
    }
    if (['number', 'text', 'textarea'].includes(e.target.type)) {
      setPageData({ ...pageData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pageData.imageUrls.length < 1) {
      alert('You must upload at leats one Image');
      return;
    }
    if (+pageData.regularPrice < +pageData.discountPrice) {
      alert('regular price should be more than discount price');
      return;
    }
    const formdata = {
      ...pageData,
      imageUrls: pageData.imageUrls,
      userRef: currentUser?.id,
    };
    try {
      setLoading(true);
      const res = await fetch(`/api/listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      // dispatch(updateUserSuccess(data));
      setLoading(false);
      setPageData(INITIAL_STATE);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      console.log(err);
      // dispatch(updateUserFailure(error));
      setLoading(false);
    }
  };

  console.log('--pg--', pageData);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg focus:outline-none"
            id="name"
            maxLength={62}
            minLength={10}
            required
            value={pageData.name}
            onChange={handleChange}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none"
            id="description"
            required
            value={pageData.description}
            onChange={handleChange}
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none"
            id="address"
            required
            value={pageData.address}
            onChange={handleChange}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="sale"
                className="w-5"
                checked={pageData.type === 'sale'}
                onChange={handleChange}
              />
              <span className="">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="rent"
                className="w-5"
                checked={pageData.type === 'rent'}
                onChange={handleChange}
              />
              <span className="">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="parking"
                className="w-5"
                checked={pageData.parking}
                onChange={handleChange}
              />
              <span className="">Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="furnished"
                className="w-5"
                checked={pageData.furnished}
                onChange={handleChange}
              />
              <span className="">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="offer"
                className="w-5"
                checked={pageData.offer}
                onChange={handleChange}
              />
              <span className="">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                id="bedrooms"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={pageData.bedrooms}
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10}
                id="bathrooms"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={pageData.bathrooms}
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={pageData.regularPrice}
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <span>Regular price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {pageData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  id="discountPrice"
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none"
                  value={pageData.discountPrice}
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <span>Discount price</span>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{' '}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full file:bg-violet-50 file:text-violet-500 hover:file:bg-violet-100: true,
              file:rounded-lg file:rounded-tr-none file:rounded-br-none: true,
              file:px-4 file:py-2 file:mr-4 file:border-none true,"
              onChange={handleSelectFiles}
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleUploadFiles}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          {pageData.imageUrls.length > 0 &&
            pageData.imageUrls.map(({ url }, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Creating' : 'Create Listing'}
          </button>
          {/* {error && <p className="text-red-500 mt-5">{error.message}</p>} */}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
