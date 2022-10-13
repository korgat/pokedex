import { FC } from 'react';

import { TPokemon } from '../../@types/type';

type TTileProps = {
    active: boolean;
    setActiveItem: React.Dispatch<React.SetStateAction<TPokemon | null>>;
} & TPokemon;

const Tile: FC<TTileProps> = ({
    id,
    active,
    name,
    largeImg,
    smallImg,
    types,
    stats,
    setActiveItem,
}) => {
    return (
        <div
            className={active ? 'item active' : 'item'}
            onClick={() => setActiveItem({ id, name, largeImg, smallImg, types, stats })}>
            <img className="item__image" src={largeImg} alt="pokemon" />
            <div className="item__title">
                <h3>{name}</h3>
                <div className="item__id">#{id}</div>
            </div>

            <ul className="item__abilities">
                {types.map((obj) => {
                    return (
                        <li key={obj.type.name} className={'ability__' + obj.type.name}>
                            {obj.type.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Tile;
