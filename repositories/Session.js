import { promisify } from "util";
import { generateToken } from "../repositories.js";

export default class Session {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async create(user_id) {
        const token = generateToken();
        const result = await this.query(
            `
            INSERT INTO Session
            (user_id, token, expires_at)
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
            `,
            [user_id, token]
        )
        return token;
    }

    async refreshToken(user_id) {
        const token = generateToken();
        const result = await this.query(
            `
            UPDATE Session
            SET token = ?, expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
            WHERE user_id = ?
            `,
            [token, user_id]
        )
        return token;
    }

    async refreshExpiresAt(user_id) {
        const result = await this.query(
            `
            UPDATE Session
            SET expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY)
            WHERE user_id = ?
            `,
            [user_id]
        )
    }

    async getToken(user_id) {
        const result = await this.query(
            `
            SELECT token
            FROM Session
            WHERE user_id = ?
            LIMIT 1
            `,
        );

        return result[0] || null;
    }

    async chekToken(token) {
        const result = await this.query(
            `
            SELECT *
            FROM Session
            WHERE token = ?
            AND expires_at > NOW()
            LIMIT 1
            `,
            [token]
        );

        const chekToken = result[0] || null;
        if(!chekToken) return false;
        if(chekToken) await this.refreshExpiresAt(chekToken.user_id);
        return chekToken;
    }

}