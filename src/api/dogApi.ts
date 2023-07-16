import axios, { AxiosHeaders } from 'axios';

const headers = new AxiosHeaders({ 'x-api-key': process.env.ANIMALS_TOKEN || '' });

const getDog = async () => axios
  .get('https://api.thedogapi.com/v1/images/search', { headers })
  .then((res) => res.data[0].url);

export default getDog;
