import connection from "./database/mysql.js";

import Users from "./repositories/Users.js";
import Pokemons from "./repositories/Pokemons.js";
import UserPokemons from "./repositories/UserPokemons.js";
import Leaderboards from "./repositories/Leaderboards.js";

export const usersRepo = new Users(connection);
export const pokemonsRepo = new Pokemons(connection);
export const userPokemonsRepo = new UserPokemons(connection);
export const leaderboardsRepo = new Leaderboards(connection);