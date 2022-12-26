const config = {
  apiBaseUrl:
    process.env.REACT_APP_API_BASE_URL ||
    'https://api.beesmart.stevenhansel.com/dashboard',
  wssBaseUrl:
    process.env.REACT_APP_WSS_BASE_URL ||
    'wss://api.beesmart.stevenhansel.com/socket',
  srsBaseUrl:
    process.env.REACT_APP_SRS_BASE_URL ||
    'https://srs.beesmart.stevenhansel.com',
};

export default config;
