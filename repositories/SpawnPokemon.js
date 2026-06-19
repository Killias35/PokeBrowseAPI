import { promisify } from "util";
import { getPokemon } from "./SpawnUtils.js";

export default class SpawnPokemon {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async canSpawn(user_id, domain_active) {
        const ret = await this.query(
            `
            SELECT *
            FROM user_pokemon
            WHERE user_id = ? AND domain_name = ?
            `,
            [user_id, domain_active]
        );

        return (
            ret.length < 5
        )
    }

    async spawn(user_id, domain_active) {
        const pokemon = await getPokemon(domain_active);

        await this.query(
            `
            INSERT INTO user_pokemon
            (
                user_id,
                pokemon_id,
                is_shiny,
                domain_name
            )
            VALUES (?, ?, ?, ?)
            `,
            [user_id, pokemon.id, pokemon.is_shiny, domain_active]
        );
    }

}