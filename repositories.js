import connection from "./database/mysql.js";

import Users from "./repositories/Users.js";
import Pokemons from "./repositories/Pokemons.js";
import UserPokemons from "./repositories/UserPokemons.js";
import Leaderboards from "./repositories/Leaderboards.js";
import Settings from "./repositories/Settings.js";
import bcrypt from "bcrypt";


export async function hashPassword(password) {
    const SALT_ROUNDS = 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
}

export const usersRepo = new Users(connection);
export const pokemonsRepo = new Pokemons(connection);
export const userPokemonsRepo = new UserPokemons(connection);
export const leaderboardsRepo = new Leaderboards(connection);
export const settingsRepo = new Settings(connection);

console.log(await (hashPassword("test")));