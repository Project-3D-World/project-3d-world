const backendBaseUrl = 'localhost:3000';

export const environment = {
  production: false,
  auth: {
    domain: 'dev-26gwf5d6an3t5in0.us.auth0.com',
    clientId: 'pVYRFnqF5KmVYtXQDu6hylYFIUq8llqZ',
  },
  apiEndpoint: 'http://' + backendBaseUrl,
  wsEndpoint: 'ws://' + backendBaseUrl,
};
