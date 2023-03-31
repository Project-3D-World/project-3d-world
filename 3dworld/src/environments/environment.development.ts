const backendBaseUrl = 'url to the backend with no protocol';

export const environment = {
  production: false,
  auth: {
    domain: 'auth0 domain',
    clientId: 'auth0 clientId',
  },
  apiEndpoint: 'http://' + backendBaseUrl,
  wsEndpoint: 'ws://' + backendBaseUrl,
};