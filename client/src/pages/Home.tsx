import {} from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          <br />
          Eum ad iure,quae iste reiciendis illum esse magnam ea officia qui,
          facilis
        </p>
        <Link
          className="text-blue-800 text-xs sm:text-sm font-bold hover:underline"
          to={`/search`}
        >
          Let's get started...
        </Link>
      </div>

      {/* slider for all offer image lisiting */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div className="">
          <div className="my-3">
            <h1 className="text-2xl font-semibold text-slate-600">
              Recent Offers
            </h1>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to={`/search?offer=true`}
            >
              Show more offers
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* 4 offer lisiting in list card */}
          </div>
        </div>
        <div className="">
          <div className="my-3">
            <h1 className="text-2xl font-semibold text-slate-600">
              Recent rentals
            </h1>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to={`/search?rent=true`}
            >
              Show more rentals
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* 4 rent lisiting in card*/}
          </div>
        </div>
        <div className="">
          <div className="my-3">
            <h1 className="text-2xl font-semibold text-slate-600">
              Recent Sales
            </h1>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to={`/search?sale=true`}
            >
              Show more sales
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* 4 sale lisiting in card*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
