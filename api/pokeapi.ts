export interface Pokemon {
  id?: string;
  name: string;
  url: string;
  sprites?: any;
  abilities?: any;
  stats?: any;
}

export interface PokemonWithImage extends Pokemon {
  id: string;
  imageUri: string;
}

export const pokeapi = async (
  limit: number = 150
): Promise<PokemonWithImage[]> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const json = await response.json();
  return json.results.map(
    (poke: Pokemon, index: number): PokemonWithImage => ({
      ...poke,
      id: (index + 1).toString(),
      imageUri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        index + 1
      }.png`,
    })
  );
};

export const pokeDetailApi = async (id: string | number): Promise<Pokemon> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const json = await response.json();
  return json;
};
