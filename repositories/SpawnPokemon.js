import { promisify } from "util";
import { getPokemon, EXPIRES_AT, MAX_SPAWNS } from "./SpawnUtils.js";

export default class SpawnPokemon {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async spawn(user_id, domain_active, expires_at) {
        const pokemon = await getPokemon(domain_active);

        await this.query(
            `
            INSERT INTO spawn_pokemon
            (
                user_id,
                pokemon_id,
                is_shiny,
                domain_name,
                expires_at
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [user_id, pokemon.id, pokemon.is_shiny, domain_active, expires_at]
        );
    }

    async spawnAll(user_id, domain_active) {    // evenement potentiel
        for (let i = 0; i < MAX_SPAWNS; i++) {
            await this.spawn(user_id, domain_active);
        }
    }

    async getSpawned(user_id, domain_active) {
        const ret = await this.query(
            `
            SELECT *
            FROM spawn_pokemon
            WHERE user_id = ? AND domain_name = ?
            AND expires_at > NOW()
            `,
            [user_id, domain_active]
        );
        return ret;
    }

    async getAllSpawned(user_id) {
        const ret = await this.query(
            `
            SELECT *
            FROM spawn_pokemon
            WHERE user_id = ?
            AND expires_at > NOW()
            `,
            [user_id]
        );
        return ret;
    }

    async deleteTooOld() {
        await this.query(
            `
            DELETE FROM spawn_pokemon
            WHERE expires_at < NOW()
            `
        );
    }

}