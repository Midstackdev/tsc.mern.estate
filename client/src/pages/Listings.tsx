import { useFetch } from '../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { IListing } from './CreateListing';
import { Link } from 'react-router-dom';

const Listings = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${currentUser?.token}`,
    },
  };
  const { data: listings, isLoading } = useFetch(
    `/api/listing/user/${currentUser?.id}`,
    options
  );
  // console.log('---d---', data);
  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Listings</h1>
      {isLoading && !listings && <>Loading...</>}
      {!isLoading && listings && (
        <div className="flex flex-wrap gap-5 p-2">
          {listings.map((listing: IListing) => (
            <div
              key={listing._id}
              className="flex flex-col gap-2 border rounded"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="w-64 h-40 object-contain"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/listing/${listing._id}`}>
                  <p className="text-slate-700 font-semibold hover:underline truncate">
                    {listing.name}
                  </p>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;
