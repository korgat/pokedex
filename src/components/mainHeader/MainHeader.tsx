import { FC } from 'react';
import AsyncSelect from 'react-select/async';

import { getPokemonTypes } from '../../API/typeAPI';
import { TPokemon } from '../../@types/type';

export type TOption = {
    value: string | null;
    label: string;
};

type TMainHeader = {
    setPokemons: React.Dispatch<React.SetStateAction<TPokemon[]>>;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    setFilter: React.Dispatch<React.SetStateAction<null | string>>;
};

const MainHeader: FC<TMainHeader> = ({ setFilter, setPokemons, setIsFetching }) => {
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
