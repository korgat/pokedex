import { FC, useCallback, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';

import { getPokemonTypes } from '../../API/typeAPI';
import { TFetchedList, TPokemon, TPokemonAPI, TResponseData } from '../../@types/type';
import { debounce } from '../../helpers/debounce';
import { transformPokemonsInfo } from '../../helpers/transformPokemonInfo';
import axios from 'axios';

import { colors } from './../../config/colors';

export type TOption = {
  value: string | null;
  label: string;
  color: string;
};

type TMainHeader = {
  setFilter: React.Dispatch<React.SetStateAction<null | string>>;
  setActiveItem: React.Dispatch<React.SetStateAction<TPokemon | null>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setPokemons: React.Dispatch<React.SetStateAction<TPokemon[]>>;
  setNextLoadURL: React.Dispatch<React.SetStateAction<null | string>>;
  onLoadMoreClick: (url?: string | null) => Promise<void>;
  setTypedPokemons: React.Dispatch<React.SetStateAction<TPokemon[]>>;
};

const MainHeader: FC<TMainHeader> = ({
  setFilter,
  setActiveItem,
  setIsFetching,
  setPokemons,
  setNextLoadURL,
  onLoadMoreClick,
  setTypedPokemons,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  function onDeleteClick() {
    setInput('');
    inputRef.current?.focus();
  }

  const debounceOnInputChange = useCallback(
    debounce(async (str: string) => {
      if (str) {
        try {
          const pokemonInfo = await transformPokemonsInfo([
            axios.get(`https://pokeapi.co/api/v2/pokemon/${str.toLowerCase()}`),
          ]);
          console.log(pokemonInfo[0]);
          setActiveItem(pokemonInfo[0]);
        } catch (error) {
          setActiveItem({
            id: 0,
            name: "Pokemon doesn't exist",
            types: [],
            stats: [],
            largeImg: 'pokeball.png',
            smallImg: '"pokeball.png"',
          });
        }
      }
    }, 800),
    [],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    debounceOnInputChange(e.target.value);
  };

  const handleSelectChange = async (value: TOption | null) => {
    if (value?.value) {
      setIsFetching(true);

      const { data } = await axios
        .get<TResponseData | TFetchedList>(value.value)
        .then((res) => res);

      let pokemonArrAPI;
      if ('results' in data) {
        pokemonArrAPI = data.results;
      } else {
        pokemonArrAPI = data.pokemon;
      }

      const fullDescriptions = pokemonArrAPI.map((obj: any) => {
        return axios.get<TPokemonAPI>(obj.url || obj.pokemon.url);
      });
      const pokemonsInfo = await transformPokemonsInfo(fullDescriptions);

      if (value.label === 'All' && 'next' in data) {
        setPokemons(pokemonsInfo);
        setTypedPokemons([]);
        setNextLoadURL(data.next);
        setIsFetching(false);
      } else {
        const givenArr = pokemonsInfo;
        const cutArr = givenArr.splice(0, 12);
        setPokemons(cutArr);
        setTypedPokemons(givenArr);
        setNextLoadURL('');
        setIsFetching(false);
      }
    }
  };

  const loadOptions = (searchValue: string, cb: (arr: TOption[]) => void) => {
    (async () => {
      try {
        const data = await getPokemonTypes();
        const parsedOptions = data.results.map((obj) => {
          return {
            value: obj.url,
            label: obj.name,
            color: colors[obj.name] || '#808080',
          };
        });

        cb([
          {
            label: 'All',
            value: 'https://pokeapi.co/api/v2/pokemon/?limit=12',
            color: '#dadada',
          },
          ...parsedOptions,
        ]);
      } catch (error) {
        console.log('header select options', error);
      }
    })();
  };

  const styles = {
    option: (provided: any, state: any) => {
      return {
        ...provided,
        color: 'white',
        backgroundColor: state.data.color,
      };
    },
    control: (provided: any, state: any) => {
      const optionColor = state.getValue()[0];
      return {
        ...provided,
        color: 'white',
        backgroundColor: optionColor ? optionColor.color : '#fff',
      };
    },
  };

  return (
    <div className="main-header">
      <div className="main-header__input">
        <input
          value={input}
          ref={inputRef}
          onChange={onInputChange}
          type="text"
          placeholder="Enter name or id"
        />
        <button onClick={onDeleteClick} className="clear-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.22566 4.81096C5.83514 4.42044 5.20197 4.42044 4.81145 4.81096C4.42092 5.20148 4.42092 5.83465 4.81145 6.22517L10.5862 11.9999L4.81151 17.7746C4.42098 18.1651 4.42098 18.7983 4.81151 19.1888C5.20203 19.5793 5.8352 19.5793 6.22572 19.1888L12.0004 13.4141L17.7751 19.1888C18.1656 19.5793 18.7988 19.5793 19.1893 19.1888C19.5798 18.7983 19.5798 18.1651 19.1893 17.7746L13.4146 11.9999L19.1893 6.22517C19.5799 5.83465 19.5799 5.20148 19.1893 4.81096C18.7988 4.42044 18.1657 4.42044 17.7751 4.81096L12.0004 10.5857L6.22566 4.81096Z" />
          </svg>
        </button>
      </div>
      <div className="main-header__select">
        <AsyncSelect
          classNamePrefix="react-select"
          loadOptions={loadOptions}
          defaultOptions
          isSearchable={false}
          onChange={handleSelectChange}
          cacheOptions
          styles={styles}
        />
      </div>
    </div>
  );
};

export default MainHeader;
