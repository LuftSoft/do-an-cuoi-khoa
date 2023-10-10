import React from 'react';
import { RotateLoader } from 'react-spinners';

const Loading = ({ isLoading }) => (
  <div className="flex justify-center items-center absolute inset-0 z-20" style={{ backgroundColor: '#757577a8' }}>
    <RotateLoader loading={isLoading} color="#ade8f4" margin={20} size={20} />
  </div>
);

export default Loading;
