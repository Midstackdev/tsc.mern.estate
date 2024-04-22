import React, { useState } from 'react';
import { AppError, InputChangeEventHandler } from '../types';

type ImageUrl = { fileId: string; publicId: string; url: string };
type PageData = {
  imageUrls: ImageUrl[];
};

const CreateListing = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<
    'initial' | 'uploading' | 'success' | 'fail'
  >('initial');
  const [pageData, setPageData] = useState<PageData>({ imageUrls: [] });
  const [error, setError] = useState<AppError | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleSelectFiles = (e: InputChangeEventHandler) => {
    setFiles(e.target.files);
  };

  const handleRemoveImage = (index: number) => {
    setPageData({
      ...pageData,
      imageUrls: pageData.imageUrls.filter((_, i) => i !== index),
    });
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
        setStatus('uploading');

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
            setStatus('fail');
            reject(data);
          }

          setStatus('success');
          resolve(data);
        };
        fetchData();
      }
    });
  };

  console.log('--pg--', pageData);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg focus:outline-none"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none"
            id="description"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" name="" id="sale" className="w-5" />
              <span className="">Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="rent" className="w-5" />
              <span className="">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="parking" className="w-5" />
              <span className="">Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="furnished" className="w-5" />
              <span className="">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="" id="offer" className="w-5" />
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
              />
              <div className="flex flex-col items-center">
                <span>Regular price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                id="discountPrice"
                required
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
              />
              <div className="flex flex-col items-center">
                <span>Discount price</span>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
        {/* {error && <p className="text-red-500 mt-5">{error.message}</p>} */}
      </form>
    </main>
  );
};

export default CreateListing;
