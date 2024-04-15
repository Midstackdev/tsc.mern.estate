import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, InputChangeEventHandler } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';
import { RootState } from '../redux/store';
import OAuth from '../components/OAuth';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: InputChangeEventHandler) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      console.log(data);
      dispatch(signInSuccess(data));
      navigate('/profile');
    } catch (err) {
      dispatch(signInFailure(err));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg focus:outline-none"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg focus:outline-none"
          id="password"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'loading...' : 'Sign in'}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error.message}</p>}
    </div>
  );
};

export default SignIn;
