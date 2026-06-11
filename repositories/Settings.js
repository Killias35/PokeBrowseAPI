import { promisify } from "util";

export default class Settings {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async get() {

        const result = await this.query(
            `
            SELECT *
            FROM settings
            LIMIT 1
            `,
        );

        return result[0] || null;
    }

}