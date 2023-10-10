import { GET_USER_FALSE, GET_USER_PENDING, GET_USER_SUCCESS, LOGIN, LOGIN_FALSE, LOGIN_PENDING, LOGIN_SUCCESS } from '../utils/constant/typeReducer';
import { save } from '../utils/localstorage';

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_PENDING: {
      return { ...state, isLoading: true };
    }
    case LOGIN_SUCCESS: {
      save('accessToken', action.payload.accessToken);
      return { ...state, isLoading: false, accessToken: action.payload.accessToken };
    }
    case LOGIN_FALSE: {
      return { ...state, isLoading: false, error: action.payload };
    }

    case GET_USER_PENDING: {
      return { ...state, isLoading: true };
    }
    case GET_USER_SUCCESS: {
      save('user', action.payload.userDto);
      return { ...state, isLoading: false, user: action.payload.userDto };
    }
    case GET_USER_FALSE: {
      return { ...state, isLoading: false, error: action.payload };
    }
    case 'LOGOUT': {
      return { ...state, accessToken: '' };
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
