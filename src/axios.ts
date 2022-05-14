import Axios from 'axios';

const baseUrl = 'https://enchridion-api.stevenhansel.com/dashboard';

export default Axios.create({
  baseURL: baseUrl,
});
