import React, { useEffect } from 'react';
import { useFetch } from '../hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const OAuth = () => {
  const { data } = useFetch('/api/auth/login/google');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getLoginData = async () => {
      try {
        if (location?.pathname === '/auth/google/callback') {
          const res = await fetch(
            `/api/auth/login/google/callback${location?.search}`
          );

          const data = await res.json();
          if (!res.ok) throw data;
          console.log(data);
          dispatch(signInSuccess(data));
          navigate('/profile');
        }
      } catch (error) {
        console.log('could not sign in with oauth', error);
      }
    };
    getLoginData();
  }, [location, dispatch, navigate]);

  return (
    <Link to={data?.url}>
      <li className="bg-red-700 w-full text-center rounded-lg text-white p-3 uppercase">
        Continue with Google
      </li>
    </Link>
  );
};

export default OAuth;
