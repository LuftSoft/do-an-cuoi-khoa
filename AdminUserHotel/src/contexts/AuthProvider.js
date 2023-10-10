import React, { useMemo } from 'react';
import authReducer from '../reducer/auth.reducer';
import { getDataUserAPI, loginAPI } from '../service/auth.service';
import { GET_USER_FALSE, GET_USER_PENDING, GET_USER_SUCCESS, LOGIN_FALSE, LOGIN_PENDING, LOGIN_SUCCESS } from '../utils/constant/typeReducer';
import { get, save } from '../utils/localstorage';

const { createContext, useContext, useReducer } = require('react');

const AuthContext = createContext();
const initState = {
  accessToken: '',
  user: null,
  error: null,
  isLoading: false,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initState);

  const getDataUser = async (accessToken) => {
    try {
      console.log(get('accessToken'));
      dispatch({ type: GET_USER_PENDING });
      const response = await getDataUserAPI(accessToken);
      dispatch({ type: GET_USER_SUCCESS, payload: response.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: GET_USER_FALSE, payload: error.response.data });
    }
  };

  const login = async (user) => {
    try {
      dispatch({ type: LOGIN_PENDING });
      const response = await loginAPI(user);
      console.log(response.data);
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      getDataUser(response.data.accessToken);
    } catch (error) {
      console.log(error);
      dispatch({ type: LOGIN_FALSE, payload: error.response.data });
    }
  };

  const value = useMemo(() => ({ ...state, login, getDataUser }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
