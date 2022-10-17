import axios from 'axios';
import { TFetchedList } from '../@types/type';

export const getPokemonTypes = () => {
  return axios.get<TFetchedList>('https://pokeapi.co/api/v2/type').then(({ data }) => {
    return data;
  });
};
