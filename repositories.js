import connection from "./database/mysql.js";

import Users from "./repositories/Users.js";
import Pokemons from "./repositories/Pokemons.js";
import UserPokemons from "./repositories/UserPokemons.js";
import Leaderboards from "./repositories/Leaderboards.js";
import Settings from "./repositories/Settings.js";
import Session from "./repositories/Session.js";
import SpawnPokemon from "./repositories/SpawnPokemon.js";
import Encouters from "./repositories/Encouters.js";
import UserEncouters from "./repositories/UserEncouters.js";
import PokeballUsers from "./repositories/PokeballUsers.js";
import Pokeballs from "./repositories/Pokeballs.js";

import crypto from "crypto";
import bcrypt from "bcrypt";


export async function hashPassword(password) {
    const SALT_ROUNDS = 10;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
}

export async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export function generateToken() {
  return crypto.randomUUID();
}

export const usersRepo = new Users(connection);
export const pokemonsRepo = new Pokemons(connection);
export const userPokemonsRepo = new UserPokemons(connection);
export const leaderboardsRepo = new Leaderboards(connection);
export const settingsRepo = new Settings(connection);
export const sessionRepo = new Session(connection);
export const spawnRepo = new SpawnPokemon(connection);
export const encountersRepo = new Encouters(connection);
export const encountersUserRepo = new UserEncouters(connection);
export const pokeballUsersRepo = new PokeballUsers(connection);
export const pokeballsRepo = new Pokeballs(connection);
