import { useCallback, useRef, useState, useEffect } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import axios from 'axios';

import getPokemonTypes from '../../API/typeAPI';
import { TFetchedList, TPokemon, TPokemonAPI, TResponseData } from '../../@types/type';
import debounce from '../../helpers/debounce';
import transformPokemonsInfo from '../../helpers/transformPokemonInfo';

import colors from '../../config/colors';

export type TOption = {
  value: string;
  label: string;
  color: string;
};

type TMainHeader = {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setActiveItem: React.Dispatch<React.SetStateAction<TPokemon | null>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setPokemons: React.Dispatch<React.SetStateAction<TPokemon[]>>;
  setNextLoadURL: React.Dispatch<React.SetStateAction<null | string>>;
  setTypedPokemons: React.Dispatch<React.SetStateAction<TPokemon[]>>;
};

function MainHeader({
  setFilter,
  setActiveItem,
  setIsFetching,
  setPokemons,
  setNextLoadURL,
  setTypedPokemons,
}: TMainHeader) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [types, SetTypes] = useState<TOption[]>([]);
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPokemonTypes();
        const parsedOptions = data.results.map((obj) => ({
          value: obj.url,
          label: obj.name,
          color: colors[obj.name] || '#808080',
        }));

        const typesOptions = [
          {
            label: 'All',
            value: 'https://pokeapi.co/api/v2/pokemon/?limit=12',
            color: '#dadada',
          },
          ...parsedOptions,
        ];
        SetTypes(typesOptions);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('header select options', error);
      }
    })();
  }, []);

  function onDeleteClick() {
    setInput('');
    inputRef.current?.focus();
  }

  const debounceOnInputChange = useCallback(
    debounce(async (str) => {
      if (str) {
        try {
          const pokemonInfo = await transformPokemonsInfo([
            axios.get(`https://pokeapi.co/api/v2/pokemon/${str.toLowerCase()}`),
          ]);
          setActiveItem(pokemonInfo[0]);
        } catch (error) {
          setActiveItem({
            id: 0,
            name: "Pokemon doesn't exist",
            types: [],
            stats: [],
            largeImg: 'pokeball.png',
            smallImg: 'pokeball.png',
          });
        }
      }
    }, 800),
    []
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    debounceOnInputChange(e.target.value);
  };

  const handleFilterChange = (newValue: SingleValue<TOption>) => {
    if (newValue) {
      setFilter(newValue.label);
    }
  };

  const handleSelectChange = async (value: TOption | null) => {
    if (value?.value) {
      if (value.label !== 'All') {
        setShowFilter(false);
      }
      setIsFetching(true);
      setPokemons([]);

      const { data } = await axios.get<TResponseData | TFetchedList>(value.value).then((res) => res);

      let pokemonArrAPI;
      if ('results' in data) {
        pokemonArrAPI = data.results;
      } else {
        pokemonArrAPI = data.pokemon;
      }

      const fullDescriptions = pokemonArrAPI.map((obj) => {
        let url;
        if ('url' in obj) {
          url = obj.url;
        } else {
          url = obj.pokemon.url;
        }
        return axios.get<TPokemonAPI>(url);
      });
      const pokemonsInfo = await transformPokemonsInfo(fullDescriptions);

      if (value.label === 'All' && 'next' in data) {
        setPokemons(pokemonsInfo);
        setTypedPokemons([]);
        setNextLoadURL(data.next);
        setIsFetching(false);
        setShowFilter(true);
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

  const styles: StylesConfig<TOption, false> = {
    option: (provided, state) => ({
      ...provided,
      color: 'white',
      backgroundColor: state.data.color,
    }),
    control: (provided, state) => {
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
        <input value={input} ref={inputRef} onChange={onInputChange} type="text" placeholder="Enter name or id" />
        <button type="button" onClick={onDeleteClick} className="clear-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.22566 4.81096C5.83514 4.42044 5.20197 4.42044 4.81145 4.81096C4.42092 5.20148 4.42092 5.83465 4.81145 6.22517L10.5862 11.9999L4.81151 17.7746C4.42098 18.1651 4.42098 18.7983 4.81151 19.1888C5.20203 19.5793 5.8352 19.5793 6.22572 19.1888L12.0004 13.4141L17.7751 19.1888C18.1656 19.5793 18.7988 19.5793 19.1893 19.1888C19.5798 18.7983 19.5798 18.1651 19.1893 17.7746L13.4146 11.9999L19.1893 6.22517C19.5799 5.83465 19.5799 5.20148 19.1893 4.81096C18.7988 4.42044 18.1657 4.42044 17.7751 4.81096L12.0004 10.5857L6.22566 4.81096Z" />
          </svg>
        </button>
      </div>
      <div className="main-header__select-block">
        {showFilter && (
          <div className="main-header__filter">
            <Select
              classNamePrefix="react-select"
              isSearchable={false}
              styles={styles}
              placeholder="Set filter"
              options={types}
              onChange={handleFilterChange}
            />
          </div>
        )}
        <div className="main-header__load-type">
          <Select
            classNamePrefix="react-select"
            defaultValue={{
              label: 'All',
              value: 'https://pokeapi.co/api/v2/pokemon/?limit=12',
              color: '#dadada',
            }}
            isSearchable={false}
            styles={styles}
            placeholder="Load by type"
            options={types}
            onChange={handleSelectChange}
          />
        </div>
      </div>
    </div>
  );
}

export default MainHeader;
