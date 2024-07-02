import { useEffect, useState } from 'react';
import { SearchIcon } from '../assets/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Navbar = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('term', searchTerm);
    const query = urlParams.toString();

    navigate(`/search?${query}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('term');

    if (search) {
      setSearchTerm(search);
    }
  }, []);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to={'/'}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Surop</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search...."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>
            <SearchIcon className="text-slate-600 w-4 h-4 cursor-pointer" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to={'/'}>
            <li className="hidden sm:inline text-slate-700 hover:cursor-pointer">
              Home
            </li>
          </Link>
          <Link to={'/about'}>
            <li className="hidden sm:inline text-slate-700 hover:cursor-pointer">
              About
            </li>
          </Link>
          {currentUser ? (
            <>
              <Link to={'/user/listings'}>
                <li className="hidden sm:inline text-slate-700 hover:cursor-pointer">
                  My Listings
                </li>
              </Link>
              <Link to={'/profile'}>
                <img
                  src={currentUser?.picture ?? '/avatar.png'}
                  className="rounded-full h-7 w-7"
                  alt="profile"
                />
              </Link>
            </>
          ) : (
            <Link to={'/sigin-in'}>
              <li className="hidden sm:inline text-slate-700 hover:cursor-pointer">
                SignIn
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
