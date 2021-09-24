import axios from 'axios';

export const buildClient = ({ req }) => {
  /**
   * @type {import('axios').AxiosRequestConfig}
   */
  const options = {};

  if (typeof window === 'undefined') {
    options.baseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    options.headers = req.headers;
  }

  return axios.create(options);
};
