import axios from 'axios';
import { TFetchedList } from '../@types/type';

const pokemonURL = 'https://pokeapi.co/api/v2/pokemon/';

type TListParams = {
  offset?: number;
  limit: number;
};

const getPokemonList = (url: string = pokemonURL, params?: TListParams) =>
  axios.get<TFetchedList>(url, { params }).then((result) => result);

export default getPokemonList;
