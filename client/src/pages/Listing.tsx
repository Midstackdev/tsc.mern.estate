import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks';
import Slider from '../components/Slider';
import {
  BathIcon,
  BedIcon,
  CouchIcon,
  LocationIcon,
  ParkIcon,
} from '../assets/icons';
import { IListing } from './CreateListing';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useState } from 'react';
import Contact from '../components/Contact';

const Listing = () => {
  const params = useParams();
  const lisitingId = params.id;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const { data, isLoading } = useFetch(`/api/listing/${lisitingId}`, options);

  const listing: IListing = data;
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [contact, setContact] = useState(false);

  return (
    <main>
      {isLoading && !listing && (
        <p className="text-center my-7 text-2xl">Loading...</p>
      )}
      {!isLoading && listing && (
        <main className="">
          <Slider images={listing.imageUrls} />
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              {' '}
              <LocationIcon className="stroke-green-600 w-4 h-4 cursor-pointer" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>

              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>{' '}
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <BedIcon className="text-lg w-4 h-4 cursor-pointer" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <BathIcon className="text-lg w-4 h-4 cursor-pointer" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <ParkIcon className="text-lg w-4 h-4 cursor-pointer" />
                {listing.parking ? ` Parking` : ` No parking`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <CouchIcon className="text-lg w-4 h-4 cursor-pointer" />
                {listing.furnished ? ` Furnished` : ` UnFurnished`}
              </li>
            </ul>
            {currentUser &&
              listing.userRef?._id !== currentUser.id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listing={listing} />}
          </div>
        </main>
      )}
    </main>
  );
};

export default Listing;
