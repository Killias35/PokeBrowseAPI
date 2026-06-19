import { encountersRepo } from "../repositories.js";

async function loadSpawnConfig() {
    const table = encountersRepo.getAll();
    return table;
}

function domainToSeed(domain) {
  let hash = 5381;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash * 33) ^ domain.charCodeAt(i);
  }
  return Math.abs(hash);
}

// PRNG déterministe (Mulberry32) — toujours la même séquence pour un seed donné
function createRng(seed) {
  let s = seed;
  return function () {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export async function getSpawnsForDomain(Pokemon, domain) {
  const encoutersTable = await loadSpawnConfig();
  const pokedex = Pokemon.getAll();
  const seed = domainToSeed(domain);
  const rng = createRng(seed);

  // Nombre de spawns entre 10 et 20
  const spawnCount = 10 + (seed % 11);

  // Pokémon garantis pour ce domaine
  const guaranteed = encoutersTable[domain] ?? [];

  // Tous les Pokémon garantis de tous les domaines
  const excludedIds = new Set();

  for (const ids of Object.values(encoutersTable)) {
    for (const id of ids) {
      excludedIds.add(id);
    }
  }

  // Pool de base sans aucun Pokémon garanti
  const basePool = [];

  for (let i = 1; i <= pokedex.length; i++) {
    if (!excludedIds.has(i)) {
      basePool.push(i);
    }
  }

  // Shuffle Fisher-Yates déterministe
  for (let i = basePool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [basePool[i], basePool[j]] = [basePool[j], basePool[i]];
  }

  const needed = Math.max(0, spawnCount - guaranteed.length);
  const picked = basePool.slice(0, needed);

  // Ajout des garantis du domaine
  const ids = [...new Set([...guaranteed, ...picked])];

  return ids.map(id => ({
    ...pokedex[id - 1],
    isGuaranteed: guaranteed.includes(id)
  }));
}

export async function getPokemon(domaine) {
    const pool = await getSpawnsForDomain(domaine);
    const pokemon = pool[Math.floor(Math.random() * pool.length)];
    pokemon.isShiny = Math.random() < shinyChance ? true : false;
    pokemon.domaine = domaine;
}

console.log(await loadSpawnConfig());