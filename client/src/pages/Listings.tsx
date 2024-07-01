// import { useFetch } from '../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { IListing } from './CreateListing';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Listings = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<IListing[]>([]);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  // const options = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${currentUser?.token}`,
  //   },
  // };
  // const { data: listings, isLoading } = useFetch(
  //   `/api/listing/user/${currentUser?.id}`,
  //   options
  // );

  useEffect(() => {
    const getListings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/listing/user/${currentUser?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        const data = await res.json();
        setListings(data);
        setIsLoading(false);
        setIsError(false);
        if (!res.ok) throw data;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
      }
    };
    getListings();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/listing/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setListings((prev) =>
          prev.filter((listing: IListing) => listing._id !== id)
        );
      }
      if (!res.ok) throw data;
    } catch (error) {
      console.log(error);
    }
  };

  const goToEdit = (id: string) => {
    navigate(`/edit-listing/${id}`);
  };
  // console.log('---d---', data);
  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Listings</h1>
      {isLoading && !listings && <>Loading...</>}
      {!isLoading && isError && <>Something went wrong...</>}
      {!isLoading && !isError && listings && (
        <div className="flex flex-wrap gap-5 p-2">
          {listings.map((listing: IListing) => (
            <div
              key={listing._id}
              className="flex flex-col gap-2 border rounded"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0].url ?? listing.imageUrls[0]}
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
                <button
                  onClick={() => handleDelete(listing._id)}
                  type="button"
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <button
                  className="text-green-700 uppercase"
                  onClick={() => goToEdit(listing._id)}
                  type="button"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;
