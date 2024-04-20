import React from 'react';

const CreateListing = () => {
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
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
