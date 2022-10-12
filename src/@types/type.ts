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
