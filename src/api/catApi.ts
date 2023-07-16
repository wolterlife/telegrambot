import axios, { AxiosHeaders } from 'axios';

const headers = new AxiosHeaders({ 'x-api-key': process.env.ANIMALS_TOKEN || '' });

const getCat = async () => axios
  .get('https://api.thecatapi.com/v1/images/search', { headers })
  .then((res) => res.data[0].url);

export default getCat;
