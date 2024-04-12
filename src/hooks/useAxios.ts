// const fetchWithAxios =
//   ({ options, FETCH_TYPE, SUCCESS_TYPE, ERROR_TYPE }) =>
//   async (dispatch) => {
//     dispatch({ type: FETCH_TYPE });
//     try {
//       const { data } = await axios(options);
//       dispatch({
//         type: SUCCESS_TYPE,
//         ...data,
//       });
//     } catch (error) {
//       dispatch({
//         type: ERROR_TYPE,
//         message:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.response,
//       });
//       console.error(error.response);
//     }
//   };
