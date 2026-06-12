import { promisify } from "util";

export default class UserPokemons {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async capture(
        userId,
        pokemonId,
        isShiny = false,
        domainName = null
    ) {

        const result = await this.query(
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
            [
                userId,
                pokemonId,
                isShiny,
                domainName
            ]
        );

        return result.insertId;
    }

    async getUserCaptures(userId) {

        return await this.query(
            `
            SELECT *
            FROM user_pokemon
            WHERE user_id = ?
            `,
            [userId]
        );

    }

    async freePokemons(userId) {

        const result = await this.query(
            `
            DELETE FROM user_pokemon
            WHERE user_id = ?
            `,
            [userId]
        );

        return result.affectedRows > 0;

    }

}