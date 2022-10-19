import { TPokemon } from '../@types/type';

const transformPokemonsInfo = (
  promisesArr: Array<Promise<any>>
): Promise<TPokemon[]> =>
  Promise.all(promisesArr).then((res) => {
    const pokemonsInfo = res.map(({ data }) => {
      const stats = data.stats.map((obj: any) => ({
        name: obj.stat.name,
        stat: obj.base_stat,
      }));
      stats.push({ name: 'weight', stat: data.weight });
      stats.push({ name: 'total moves', stat: data.moves.length });

      return {
        name: data.name,
        types: data.types,
        smallImg: data.sprites.front_default,
        largeImg:
          data.sprites.other.dream_world.front_default ||
          data.sprites.other['official-artwork'].front_default ||
          data.sprites.front_default ||
          'pokeball.png',
        id: data.id,
        stats,
      };
    });
    return pokemonsInfo;
  });

export default transformPokemonsInfo;
