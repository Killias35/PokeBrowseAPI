import { settingsRepo, pokemonsRepo } from "./repositories.js";

// recupere un pokemon
export async function getPokemon(id) {

    const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}`
    );

    const pokemon = await pokemonRes.json();
    const speciesRes = await fetch(
        pokemon.species.url
    );
    const species = await speciesRes.json();
    
    const frenchName =
    species.names.find(
        n => n.language.name === "fr"
    )?.name || pokemon.name;
    
    let stats = {}
    let sumStats = 0;
    let rarity = 'commun';
    for (const stat of pokemon.stats) {
        stats[stat.stat.name] = stat.base_stat;
        sumStats += stat.base_stat;
    }
    if (sumStats >= 580) rarity = 'legendary';
    else if (sumStats >= 500) rarity = 'epic';
    else if (sumStats >= 400) rarity = 'rare';
    
    const generationId = species.generation.url
    .split('/')
    .filter(Boolean)
    .pop();

    pokemon.rarity = rarity;
    pokemon.sumStats = sumStats;
    pokemon.generation = generationId;

    return {
        id: pokemon.id,
        name: frenchName,
        sprite: pokemon.sprites.front_default,
        shiny: pokemon.sprites.front_shiny,
        height: pokemon.height,
        weight: pokemon.weight,
        type1: pokemon.types[0].type.name,
        type2: pokemon.types[1]?.type.name,
        rarity: pokemon.rarity,
        sumStats: pokemon.sumStats,
        generation: pokemon.generation
    };
}

export async function setPokedex(nb) {
    const pokedex = [];
    for (let i = 1; i <= nb; i++) {

        const pokemon = await getPokemon(i);
        console.log(i, pokemon.name);
        pokedex.push(pokemon);
    }
    return pokedex;
}

export async function seedDB() {
    const settings = await settingsRepo.get();
    const pokedex = await setPokedex(settings.nb_pokemons);
    
    console.log(`Seed DB with ${pokedex.length} pokemons from 1 to ${settings.nb_pokemons}`);
    for (const pokemon of pokedex) {
        console.log(pokemon.name);
        await pokemonsRepo.create(pokemon);
    }
}

await seedDB();