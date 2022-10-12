import { useEffect, useState } from 'react';
import axios from 'axios';

import { Description, Loader, MainHeader, Tile } from './components';

import { TFetchedList, TPokemon, TPokemonListResult } from './@types/type';
import { getPokemonList } from './API/pokemonAPI';
import { transformPokemonsInfo } from './helpers/transformPokemonInfo';
import './style/style.scss';

function App() {
    const [list, setList] = useState<TFetchedList>();
    const [activeItem, setActiveItem] = useState<TPokemon | null>(null);
    const [pokemons, setPokemons] = useState<TPokemon[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    const onLoadMoreClick = async () => {
        const url = list?.next;
        if (url) {
            setIsFetching(true);
            try {
                const { data } = await getPokemonList(url);
                setList(data);
                console.log(data);
                const fullDescriptions = data.results.map(({ url }) => axios.get(url));

                const pokemonsInfo = await transformPokemonsInfo(fullDescriptions);
                setPokemons((prevPokemons) => [...prevPokemons, ...pokemonsInfo]);
                setIsFetching(false);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getPokemonList(undefined, { limit: 12 });
                setList(data);

                const fullDescriptions = data.results.map(({ url }: TPokemonListResult) =>
                    axios.get(url),
                );

                const pokemonsInfo = await transformPokemonsInfo(fullDescriptions);
                setPokemons((prevPokemons) => [...prevPokemons, ...pokemonsInfo]);

                setIsFetching(false);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    let filteredPokemons = pokemons;
    if (filter) {
        filteredPokemons = pokemons.filter((obj) => {
            return obj.types.some((obj) => obj.type.name === filter);
        });
    }

    return (
        <div className="App">
            <div className="container">
                <div className="page__title">
                    <div></div>
                    <h1>Pokedex</h1>
                </div>
                <div className="main">
                    <MainHeader
                        setFilter={setFilter}
                        setIsFetching={setIsFetching}
                        setPokemons={setPokemons}
                    />
                    <div className="main-wrapper">
                        <div className="main__left">
                            <div className="main__list">
                                {filteredPokemons.map((obj) => (
                                    <Tile
                                        key={obj.id}
                                        {...obj}
                                        active={activeItem?.id === obj.id}
                                        setActiveItem={setActiveItem}
                                    />
                                ))}
                            </div>
                            {isFetching ? (
                                <Loader />
                            ) : (
                                <button className="main__load-btn" onClick={onLoadMoreClick}>
                                    Load More
                                </button>
                            )}
                        </div>
                        {activeItem && (
                            <div className="main__right">
                                <Description setActiveItem={setActiveItem} {...activeItem} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
