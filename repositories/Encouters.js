import { promisify } from "util";


export default class Encouters {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async getAll() {
        const data = await this.query(`
            SELECT * FROM encounters
        `);
        return data;
    }
}
