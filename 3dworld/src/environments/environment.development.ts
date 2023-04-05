const backendBaseUrl = 'backend url with no protocal';

export const environment = {
  production: false,
  auth: {
    domain: 'your domain',
    clientId: 'client',
  },
  apiEndpoint: 'http://' + backendBaseUrl,
  wsEndpoint: 'ws://' + backendBaseUrl,
};
