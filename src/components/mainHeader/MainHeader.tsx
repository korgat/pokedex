import { FC, useCallback, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';

import { getPokemonTypes } from '../../API/typeAPI';
import { TPokemon } from '../../@types/type';
import { debounce } from '../../helpers/debounce';
import { transformPokemonsInfo } from '../../helpers/transformPokemonInfo';
import axios from 'axios';

export type TOption = {
  value: string | null;
  label: string;
};

type TMainHeader = {
  setFilter: React.Dispatch<React.SetStateAction<null | string>>;
  setActiveItem: React.Dispatch<React.SetStateAction<TPokemon | null>>;
};

const MainHeader: FC<TMainHeader> = ({ setFilter, setActiveItem }) => {
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

  const handleSelectChange = (value: TOption | null) => {
    if (value) {
      setFilter(value.value);
    }
  };

  const loadOptions = (searchValue: string, cb: (arr: TOption[]) => void) => {
    (async () => {
      const data = await getPokemonTypes();
      const parsedOptions = data.results.map((obj) => {
        return { value: obj.name, label: obj.name };
      });

      cb([{ label: 'All', value: null }, ...parsedOptions]);
    })();
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
        <div onClick={onDeleteClick} className="clear-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.22566 4.81096C5.83514 4.42044 5.20197 4.42044 4.81145 4.81096C4.42092 5.20148 4.42092 5.83465 4.81145 6.22517L10.5862 11.9999L4.81151 17.7746C4.42098 18.1651 4.42098 18.7983 4.81151 19.1888C5.20203 19.5793 5.8352 19.5793 6.22572 19.1888L12.0004 13.4141L17.7751 19.1888C18.1656 19.5793 18.7988 19.5793 19.1893 19.1888C19.5798 18.7983 19.5798 18.1651 19.1893 17.7746L13.4146 11.9999L19.1893 6.22517C19.5799 5.83465 19.5799 5.20148 19.1893 4.81096C18.7988 4.42044 18.1657 4.42044 17.7751 4.81096L12.0004 10.5857L6.22566 4.81096Z" />
          </svg>
        </div>
      </div>
      <div className="main-header__select">
        <AsyncSelect
          classNamePrefix="react-select"
          loadOptions={loadOptions}
          defaultOptions
          isSearchable={false}
          onChange={handleSelectChange}
        />
      </div>
    </div>
  );
};

export default MainHeader;
