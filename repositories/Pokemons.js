import { promisify } from "util";

export default class Pokemons {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async create(data) {

        const result = await this.query(
            `
            INSERT INTO pokemon
            (
                id,
                name,
                type1,
                type2,
                height,
                weight,
                generation
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                data.id,
                data.name,
                data.type1,
                data.type2,
                data.height,
                data.weight,
                data.generation
            ]
        );

        return result.insertId;
    }

    async getById(id) {

        const result = await this.query(
            `
            SELECT *
            FROM pokemon
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return result[0] || null;
    }

}