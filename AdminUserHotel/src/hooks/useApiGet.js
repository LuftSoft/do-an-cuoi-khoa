import React, { useEffect, useState } from 'react';
import { axiosToken } from '../service/axios.service';

const useApiGet = (url, deps = null) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchApi = () => {
    axiosToken
      .get(url)
      .then((response) => {
        setLoading(false);
        setData(response.data);
        return response;
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError(err);
      });
  };

  useEffect(() => {
    fetchApi();
  }, [deps && deps]);

  return { loading, data, error };
};

export default useApiGet;
