import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks';
import Slider from '../components/Slider';

const Listing = () => {
  const params = useParams();
  const lisitingId = params.id;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const { data: listing, isLoading } = useFetch(
    `/api/listing/${lisitingId}`,
    options
  );

  // const [images, setImages] = useState(second)

  // const images =

  return (
    <main>
      {isLoading && !listing && (
        <p className="text-center my-7 text-2xl">Loading...</p>
      )}
      {!isLoading && listing && (
        <main className="">
          <Slider listing={listing} />
        </main>
      )}
    </main>
  );
};

export default Listing;
