const config = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    'https://api.beesmart.stevenhansel.com/dashboard',
  wssBaseUrl:
    import.meta.env.VITE_WSS_BASE_URL ||
    'wss://api.beesmart.stevenhansel.com/socket',
  srsBaseUrl:
    import.meta.env.VITE_SRS_BASE_URL ||
    'https://srs.beesmart.stevenhansel.com',
};

export default config;
