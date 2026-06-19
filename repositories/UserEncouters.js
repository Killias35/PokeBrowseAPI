import { promisify } from "util";
import { getPokemon, EXPIRES_AT, MAX_SPAWNS } from "./SpawnUtils.js";

export default class UserEncouters {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async get(user_id) {
        const ret = await this.query(
            `
            SELECT *
            FROM user_encouters
            WHERE user_id = ?
            AND expires_at > NOW()
            `,
            [user_id]
        );
        return ret;
    }

    async create(user_id) {
        const expires_at = new Date(Date.now() + EXPIRES_AT);
        const ret = await this.query(
            `
            INSERT INTO user_encouters
            (user_id, expires_at)
            VALUES (?, ?)
            `,
            [user_id, expires_at]
        )
    }

    async delete(id){
        const ret = await this.query(
            `
            DELETE FROM user_encouters
            WHERE id = ?
            `,
            [id]
        );
    }

    
    async deleteTooOld() {
        await this.query(
            `
            DELETE FROM user_encouters
            WHERE expires_at < NOW()
            `
        );
    }
}