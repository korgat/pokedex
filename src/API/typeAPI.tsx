import axios from 'axios';
import { TFetchedList } from '../@types/type';

const getPokemonTypes = () =>
  axios
    .get<TFetchedList>('https://pokeapi.co/api/v2/type')
    .then(({ data }) => data);

export default getPokemonTypes;
