import { useEffect, useState } from 'react';
import {
  FormEvent,
  InputChangeEventHandler,
  SelectChangeEvent,
} from '../types';
import { queryString } from '../helpers/url';
import { useNavigate } from 'react-router-dom';
import { IListing } from './CreateListing';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState({
    term: '',
    type: 'all',
    furnished: false,
    parking: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<IListing[]>([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlObject = Object.fromEntries(searchParams);

    setSearchQuery({
      term: urlObject.term || '',
      type: urlObject.type || 'all',
      furnished: urlObject.furnished === 'true' ? true : false,
      parking: urlObject.parking === 'true' ? true : false,
      offer: urlObject.offer === 'true' ? true : false,
      sort: urlObject.sort || 'createdAt',
      order: urlObject.order || 'desc',
    });

    const query = queryString(urlObject);

    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/listing?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

    fetchListings();
  }, [location.search]);

  const handleChange = (e: InputChangeEventHandler & SelectChangeEvent) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSearchQuery({ ...searchQuery, type: e.target.id });
    }

    if (['term'].includes(e.target.id)) {
      setSearchQuery({ ...searchQuery, term: e.target.value });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSearchQuery({
        ...searchQuery,
        [e.target.id]:
          e.target.checked || e.target.value === 'true' ? true : false,
      });
    }

    if (['sort_order'].includes(e.target.id)) {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSearchQuery({
        ...searchQuery,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/search?${queryString(searchQuery)}`);
  };

  console.log(listings);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="term"
              placeholder="search..."
              className="border rounded-lg w-full p-3 outline-none"
              value={searchQuery.term}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={searchQuery.type === 'all'}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={searchQuery.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={searchQuery.type === 'sale'}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={searchQuery.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={searchQuery.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={searchQuery.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3 outline-none"
              defaultValue={'createdAt_desc'}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">price High to Low</option>
              <option value="regularPrice_asc">price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95"
          >
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Search Results:
        </h1>
      </div>
    </div>
  );
};

export default Search;
