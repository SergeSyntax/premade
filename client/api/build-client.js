import axios from 'axios';

export const buildClient = ({ req }) => {
  /**
   * @type {import('axios').AxiosRequestConfig}
   */
  const options = {};

  if (typeof window === 'undefined') {
    options.baseURL = 'http://assign-management.xyz';
    options.headers = req.headers;
  }

  return axios.create(options);
};
