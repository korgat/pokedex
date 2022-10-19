import { useCallback } from 'react';
import typesColor from '../../config/colors';
import { TPokemon } from '../../@types/type';

type TTileProps = {
  active: boolean;
  setActiveItem: React.Dispatch<React.SetStateAction<TPokemon | null>>;
} & TPokemon;

function Tile({
  id,
  active,
  name,
  largeImg,
  smallImg,
  types,
  stats,
  setActiveItem,
}: TTileProps) {
  const onTileClick = useCallback(
    () => setActiveItem({ id, name, largeImg, smallImg, types, stats }),
    []
  );
  return (
    <div className={active ? 'item active' : 'item'}>
      <img className="item__image" src={largeImg} alt="pokemon" />
      <div className="item__title">
        <h3>{name}</h3>
        <div className="item__id">#{id}</div>
      </div>

      <ul className="item__abilities">
        {types.map((obj) => (
          <li
            key={obj.type.name}
            style={{ backgroundColor: typesColor[obj.type.name] || '#808080' }}
          >
            {obj.type.name}
          </li>
        ))}
      </ul>
      <button className="item__btn" type="button" onClick={onTileClick}>
        See details
      </button>
    </div>
  );
}

export default Tile;
