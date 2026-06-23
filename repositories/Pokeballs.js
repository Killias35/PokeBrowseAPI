import { promisify } from "util";

export default class Pokeballs {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async get(id) {

        const result = await this.query(
            `
            SELECT *
            FROM pokeballs
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return result[0] || null;
    }

}