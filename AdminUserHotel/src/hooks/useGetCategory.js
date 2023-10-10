import { useEffect, useState } from 'react';
import { axiosInstanceNotToken } from '../service/axios.service';

const useGetCategory = (url, deps = null) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchApi = () => {
    axiosInstanceNotToken
      .get(url)
      .then((response) => {
        console.log('🚀 ~ file: useGetCategory.js:13 ~ .then ~ response:', response);
        setLoading(false);
        const dataFinaly = response.data.category.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setData(dataFinaly);
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

export default useGetCategory;
