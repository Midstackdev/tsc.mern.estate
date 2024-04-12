/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useReducer } from 'react';

export const FETCH = {
  INIT: 'FETCH_INIT',
  ERROR: 'FETCH_ERROR',
  SUCCESS: 'FETCH_SUCCESS',
};

type State = {
  isLoading: boolean;
  error: any;
  data: any;
};

type ACTION_TYPE = (typeof FETCH)[keyof typeof FETCH];

type Action = {
  type: ACTION_TYPE;
  payload?: any;
  message?: string;
};

export const useFetch = (url: string, cached: boolean = false) => {
  const cache = useRef<Record<string, any>>({});

  const INITIAL_STATE: State = {
    isLoading: false,
    error: null,
    data: null,
  };

  const Reducer = (state: State, action: Action) => {
    switch (action.type) {
      case FETCH.INIT:
        return { ...state, isLoading: true, error: null };
      case FETCH.SUCCESS:
        return {
          ...state,
          isLoading: false,
          error: null,
          data: action.payload,
        };
      case FETCH.ERROR:
        return {
          ...state,
          data: null,
          isLoading: false,
          error: action.message,
        };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  //   console.log('=====cache===', cache);

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return;

    const fetchData = async () => {
      dispatch({ type: FETCH.INIT });

      if (cached && cache.current[url]) {
        dispatch({ type: FETCH.SUCCESS, payload: cache.current[url] });

        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        if (cached) cache.current[url] = json;
        if (cancelRequest) return;
        dispatch({ type: FETCH.SUCCESS, payload: json });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({
          type: FETCH.ERROR,
          message: `${error} Could not Fetch Data `,
          //   message:
          //     error.response && error.response.data.message
          //       ? error.response.data.message
          //       : error.response,
        });
      }
    };
    fetchData();

    return () => {
      cancelRequest = true;
    };
  }, [url, cached]);
  return { state };
};
