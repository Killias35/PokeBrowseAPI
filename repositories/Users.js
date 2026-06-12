import { promisify } from "util";

export default class Users {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async create(image, username, description, identifiant) {

        const result = await this.query(
            `
            INSERT INTO users
            (image, username, description, identifiant)
            VALUES (?, ?, ?, ?)
            `,
            [image, username, description, identifiant]
        );

        return result.insertId;
    }

    async getById(id) {

        const result = await this.query(
            `
            SELECT id, image, username, description, created_at
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return result[0] || null;
    }

    async getByUsername(username) {

        const result = await this.query(
            `
            SELECT id, image, username, description, created_at
            FROM users
            WHERE username = ?
            LIMIT 1
            `,
            [username]
        );

        return result[0] || null;
    }

    async getByIdentifiant(identifiant) {

        const result = await this.query(
            `
            SELECT *
            FROM users
            WHERE identifiant = ?
            LIMIT 1
            `,
            [identifiant]
        );

        return result[0] || null;
    }

    async update(identifiant, image, username, description) {

        const result = await this.query(
            `
            UPDATE users
            SET image = ?, username = ?, description = ?
            WHERE identifiant = ?
            `,
            [image, username, description, identifiant]
        );

        return result.affectedRows > 0;
    }

    async delete(id) {

        const result = await this.query(
            `
            DELETE FROM users
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows > 0;
    }

}