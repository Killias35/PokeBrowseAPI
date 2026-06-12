import { promisify } from "util";

export default class Leaderboards {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async uniquePokemon(limit = 100) {

        return await this.query(
            `
            SELECT
                u.id,
                u.username,
                u.image,
                COUNT(DISTINCT up.pokemon_id) as score
            FROM users u
            LEFT JOIN user_pokemon up
                ON up.user_id = u.id
            GROUP BY u.id, u.username, u.image
            ORDER BY score DESC
            LIMIT ?
            `,
            [limit]
        );

    }

    async totalCaptures(limit = 100) {

        return await this.query(
            `
            SELECT
                u.id,
                u.username,
                u.image,
                COUNT(up.pokemon_id) as score
            FROM users u
            LEFT JOIN user_pokemon up
                ON up.user_id = u.id
            GROUP BY u.id, u.username, u.image
            ORDER BY score DESC
            LIMIT ?
            `,
            [limit]
        );

    }

    async shinyCaptures(limit = 100) {

        return await this.query(
            `
            SELECT
                u.id,
                u.username,
                u.image,
                COUNT(up.pokemon_id) as score
            FROM users u
            LEFT JOIN user_pokemon up
                ON up.user_id = u.id
                AND up.is_shiny = 1
            GROUP BY u.id, u.username, u.image
            ORDER BY score DESC
            LIMIT ?
            `,
            [limit]
        );
    }

}