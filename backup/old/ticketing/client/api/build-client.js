import axios from 'axios';

export const buildClient = ({ req }) => {
  /**
   * @type {import('axios').AxiosRequestConfig}
   */
  const options = { baseURL: '/' };

  if (typeof window === 'undefined') {
    options.baseURL = 'http://www.assign-management.xyz';
    options.headers = req.headers;
  }

  return axios.create(options);
};
