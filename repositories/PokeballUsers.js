import { promisify } from "util";

export default class PokeballUsers {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async setStockPokeball() {

        const pokeballs = await this.query(
            `
            SELECT pu.id, UNIX_TIMESTAMP(pu.last_used_at) * 1000 AS last_used_at,
            FROM pokeball_users pu
            INNER JOIN pokeballs p
                ON p.id = pu.pokeball_id
            `
        );

        const now = Date.now();

        for (const pokeball of pokeballs) {

            if (pokeball.quantity >= pokeball.max_stock) {
                continue;
            }

            const elapsed = now - pokeball.last_used_at;
            const cooldown = pokeball.cooldown * 60 * 60 * 1000;

            const maxGenerated = pokeball.max_stock - pokeball.quantity;

            const generated = Math.min(
                maxGenerated,
                Math.floor(elapsed / cooldown)
            );

            if (generated >= 1) {

                pokeball.quantity += generated;
                pokeball.last_used_at += generated * cooldown;

                await this.query(
                    `
                    UPDATE pokeball_users
                    SET quantity = ?,
                        last_used_at = FROM_UNIXTIME(? / 1000)
                    WHERE id = ?
                    `,
                    [
                        pokeball.quantity,
                        pokeball.last_used_at,
                        pokeball.id
                    ]
                );
            }
        }
    }

    async get(id) {

        await this.setStockPokeball();

        const result = await this.query(
            `
            SELECT *
            FROM pokeball_users
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return result[0] || null;
    }

    async getUserId(user_id) {

        await this.setStockPokeball();

        const result = await this.query(
            `
            SELECT *
            FROM pokeball_users
            WHERE user_id = ?
            `,
            [user_id]
        );

        return result;
    }

    async create(user_id, pokeball_id, quantity = 0) {

        await this.setStockPokeball();

        const result = await this.query(
            `
            INSERT INTO pokeball_users
            (
                user_id,
                pokeball_id,
                quantity
            )
            VALUES (?, ?, ?)
            `,
            [
                user_id,
                pokeball_id,
                quantity
            ]
        );

        return result.insertId;
    }

    async use(user_id, pokeball_id, quantity=1) {

        const result = await this.query(
            `
            UPDATE pokeball_users
            SET quantity = quantity - ?,
                last_used_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
            AND pokeball_id = ?
            `,
            [
                quantity,
                user_id,
                pokeball_id
            ]
        );

        return result.affectedRows > 0;
    }

}