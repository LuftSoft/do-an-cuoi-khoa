import React, { useMemo } from 'react';
import Swal from 'sweetalert2';
import hotelReducer from '../reducer/hotel.reducer';
import { getDataHotelsAPI, postHotelAPI, postHotelApprovalAPI } from '../service/hotels.service';

const { createContext, useContext, useReducer } = require('react');

const HotelContext = createContext();
const initState = {
  hotels: null,
  error: null,
  isLoading: false,
};

export const HotelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hotelReducer, initState);

  const getDataHotels = async () => {
    try {
      dispatch({ type: 'GET_HOTEL_START' });
      const response = await getDataHotelsAPI();
      dispatch({ type: 'GET_HOTEL_SUCCESS', payload: response.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'GET_HOTEL_FALSE', payload: error.response.data });
    }
  };

  const postNewHotel = async (data) => {
    console.log(data);
    try {
      dispatch({ type: 'POST_HOTEL_START' });
      const response = await postHotelAPI(data);
      console.log(response);
      dispatch({ type: 'POST_HOTEL_SUCCESS' });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'POST_HOTEL_FALSE' });
    }
  };

  const postApprovalHotel = async (id) => {
    try {
      dispatch({ type: 'APPROVAL_HOTEL_START' });
      const response = await postHotelApprovalAPI(id);
      await getDataHotels();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
      console.log(response);
      dispatch({ type: 'APPROVAL_HOTEL_SUCCESS' });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'APPROVAL_HOTEL_FALSE' });
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

  const value = useMemo(() => ({ ...state, getDataHotels, postNewHotel, postApprovalHotel }), [state]);

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotelContext = () => useContext(HotelContext);
