export type TPokemonListResult = {
  name: string;
  url: string;
};

export type TType = {
  name: string;
  url: string;
};

export type TPokemon = {
  name: string;
  types: Array<{ slot: number; type: TType }>;
  stats: Array<{ name: string; stat: number }>;
  largeImg: string;
  smallImg: string;
  id: number;
};

export type TFetchedList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TPokemonListResult[];
};

export type TResponseData = {
  damage_relations: { [key: string]: Array<TType> };
  game_indices: Array<{ game_index: number; generation: TType }>;
  generation: TType;
  id: number;
  move_damage_class: TType;
  moves: TType[];
  name: string;
  names: Array<{ name: string; language: TType }>;
  past_damage_relations: Array<Object>;
  pokemon: Array<{ slot: number; pokemon: TType }>;
};

enum TKeys {
  back_default = 'back_default',
  back_female = 'back_female',
}

export type ttt = {
  [key in TKeys]: string;
};

export type TPokemonAPI = {
  abilities: Array<{ slot: number; is_hidden: boolean; ability: TType }>;
  base_experience: number;
  forms: Array<TType>;
  game_indices: Array<{ game_index: number; version: TType }>;
  height: number;
  held_items: Array<{ item: TType; version_details: Array<{ rarity: number; version: TType }> }>;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Array<{
    move: TType;
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: TType;
      version_group: TType;
    }>;
  }>;
  name: string;
  order: number;
  past_types: Array<Object>;
  species: TType;
  sprites: Object;
  stats: Array<{ base_stat: number; effort: number; stat: TType }>;
  types: Array<{ slot: number; type: TType }>;
  weight: number;
};
