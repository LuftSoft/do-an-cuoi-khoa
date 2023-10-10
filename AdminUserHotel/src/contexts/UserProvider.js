import React, { useMemo } from 'react';
import Swal from 'sweetalert2';
import userReducer from '../reducer/user.reducer';
import { blockUserAPI, getDataUserAPI, unblockUserAPI } from '../service/user.service';

const { createContext, useContext, useReducer } = require('react');

const UserContext = createContext();
const initState = {
  users: null,
  error: null,
  isLoading: false,
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initState);

  const getDataUsers = async () => {
    dispatch({ type: 'GET_USER_START' });
    try {
      const response = await getDataUserAPI();
      dispatch({ type: 'GET_USER_SUCCESS', payload: response.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'GET_USER_FALSE', payload: error.response.data });
    }
  };

  const lockUser = async (id) => {
    dispatch({ type: 'BLOCK_USER_START' });
    try {
      const response = await blockUserAPI(id);
      console.log('🚀 ~ file: UserProvider.js:33 ~ lockUser ~ response:', response);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
      getDataUsers();
      dispatch({ type: 'BLOCK_USER_SUCCESS' });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'BLOCK_USER_FALSE' });
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const unlockUser = async (id) => {
    dispatch({ type: 'BLOCK_USER_START' });
    try {
      const response = await unblockUserAPI(id);
      console.log('🚀 ~ file: UserProvider.js:33 ~ lockUser ~ response:', response);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
      getDataUsers();
      dispatch({ type: 'BLOCK_USER_SUCCESS' });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'BLOCK_USER_FALSE' });
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const value = useMemo(() => ({ ...state, getDataUsers, lockUser, unlockUser }), [state]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
