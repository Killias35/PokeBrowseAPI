import { promisify } from "util";
import bcrypt from "bcrypt";
import { checkPassword } from "../repositories.js";

const BASE_NB = 25;
function nbValide(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return false;
  }

  const n = Number(value);

  return Number.isFinite(n) && n >= 0 && n <= 2000;
}

export default class Users {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async create(image, username, description, identifiant) {
        if(!nbValide(image) || image === null) image = BASE_NB;
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

    async getForIdentifiant(username) {
        const result = await this.query(
            `
            SELECT id, identifiant
            FROM users
            WHERE username = ?
            LIMIT 1
            `,
            [username]
        );

        return (
            result[0] || null
        )
    }

    async update(id, image, username, description) {
        if(!nbValide(image) || image === null) image = BASE_NB;
        const result = await this.query(
            `
            UPDATE users
            SET image = ?, username = ?, description = ?
            WHERE id = ?
            `,
            [image, username, description, id]
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

    async getAll(){

        const result = await this.query(
            `
            SELECT id, image, username, description, created_at
            FROM users
            `
        );

        return result;
    }

    async isConnected(username, identifiant) {
        const user = await this.getForIdentifiant(username);
        if (!user) {
            return false;
        }
        return await checkPassword(identifiant, user.identifiant);
    }
}