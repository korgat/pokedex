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
                    &#128473;
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
