const config = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    'http://api.beesmart.binus.local/dashboard',
  wssBaseUrl:
    import.meta.env.VITE_WSS_BASE_URL || 'ws://api.beesmart.binus.local/socket',
  srsBaseUrl:
    import.meta.env.VITE_SRS_BASE_URL ||
    'https://srs.beesmart.stevenhansel.com',
};

export default config;
