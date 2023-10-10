const hotelReducer = (state, action) => {
  switch (action.type) {
    case 'GET_HOTEL_START': {
      return { ...state, isLoading: true };
    }
    case 'GET_HOTEL_SUCCESS': {
      return { ...state, isLoading: false, hotels: action.payload.hotels };
    }
    case 'GET_HOTEL_FALSE': {
      return { ...state, isLoading: false, error: action.payload };
    }
    case 'POST_HOTEL_START': {
      return { ...state, isLoading: true };
    }
    case 'POST_HOTEL_SUCCESS': {
      return { ...state, isLoading: false };
    }
    case 'POST_HOTEL_FALSE': {
      return { ...state, isLoading: false, error: action.payload };
    }
    case 'APPROVAL_HOTEL_START': {
      return { ...state, isLoading: true };
    }
    case 'APPROVAL_HOTEL_SUCCESS': {
      return { ...state, isLoading: false };
    }
    case 'APPROVAL_HOTEL_FALSE': {
      return { ...state, isLoading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default hotelReducer;
