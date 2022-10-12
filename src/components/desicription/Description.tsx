import { FC } from 'react';

import { colorChecker } from './../../helpers/colorChecker';
import { TPokemon } from '../../@types/type';

type TDescriptionProps = {
    setActiveItem: React.Dispatch<React.SetStateAction<TPokemon | null>>;
} & TPokemon;

const Description: FC<TDescriptionProps> = ({ stats, name, largeImg, types, setActiveItem }) => {
    return (
        <div className="description">
            <button onClick={() => setActiveItem(null)} className="description__close-btn">
                &#128473;
            </button>
            <img className="description__image" src={largeImg} alt="pokemon" />
            <h3 className="description__title">{name}</h3>
            <table className="description__table">
                <tbody>
                    <tr className="table-row">
                        <td className="table-row__description">Type</td>
                        <td className="table-row__points">
                            {types.map((obj) => (
                                <div
                                    key={obj.type.name}
                                    className={'ability ability__' + obj.type.name}>
                                    {obj.type.name}
                                </div>
                            ))}
                        </td>
                    </tr>
                    {stats.map((obj) => (
                        <tr key={obj.name} className="table-row">
                            <td className="table-row__description">{obj.name}</td>
                            <td
                                className="table-row__points"
                                style={{ color: colorChecker(obj.stat) }}>
                                {obj.stat}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Description;
