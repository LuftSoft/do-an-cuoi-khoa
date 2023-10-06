import axios from 'axios';

const myAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api`,
  // timeout: 5000,
});

export default myAxios;
