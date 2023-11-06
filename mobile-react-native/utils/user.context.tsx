import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface User {
  user: any;
  accessToken: '';
  refreshToken: '';
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
}

const initValue: User = {
  user: {},
  accessToken: '',
  refreshToken: '',
};
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<any> = ({children}) => {
  const [user, setUser] = useState(initValue);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (context) {
    return context;
  } else {
    throw new Error('Context not found!');
  }
};
