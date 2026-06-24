import { promisify } from "util";
import { pokeballsRepo } from "../repositories.js";

export default class PokeballUsers {

    constructor(connection) {
        this.connection = connection;
        this.query = promisify(connection.query).bind(connection);
    }

    async addForUserIfNotExist(user_id) {
        const pokeballs = await pokeballsRepo.getAll();
        const pokeballsIds = pokeballs.map(p => p.id);

        const pokeballsUser = await this.getUserId(user_id, false);
        const pokeballsUserIds = pokeballsUser.map(pu => pu.pokeball_id);

        for (const id of pokeballsIds) {
            if (!pokeballsUserIds.includes(id)) {
                await this.create(user_id, id);
            }
        }
    }

    async setStockPokeball(user_id) {

        await this.addForUserIfNotExist(user_id);

        const pokeballs = await this.query(
            `
            SELECT pu.id,
                pu.quantity,
                UNIX_TIMESTAMP(pu.last_used_at) * 1000 AS last_used_at,
                p.max_stock,
                p.cooldown
            FROM pokeball_users pu
            INNER JOIN pokeballs p
                ON p.id = pu.pokeball_id
            WHERE pu.user_id = ?
            `,
            [user_id]
        );

        const now = Date.now();

        for (const pokeball of pokeballs) {

            const cooldownMs = pokeball.cooldown * 60 * 60 * 1000;

            const elapsed = now - pokeball.last_used_at;

            const generated = Math.floor(elapsed / cooldownMs);

            if (generated > 0) {

                pokeball.quantity += generated;
                pokeball.last_used_at += generated * cooldownMs;
            }

            if (pokeball.quantity > pokeball.max_stock) {
                pokeball.quantity = pokeball.max_stock;
            }

            if (pokeball.quantity < 0) {
                pokeball.quantity = 0;
            }

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

    async get(id, user_id) {

        await this.setStockPokeball(user_id);

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

    async getUserId(user_id, setStock = true) {
        if(setStock){
            await this.setStockPokeball(user_id);
        }
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

    async show(user_id) {
        await this.setStockPokeball(user_id);
        const pokeballs = await this.query(
            `
            SELECT
                pu.id,
                pu.user_id,
                pu.pokeball_id,
                pu.quantity,
                UNIX_TIMESTAMP(pu.last_used_at) * 1000 AS last_used_at,

                p.name,
                p.sprite,
                p.ball_power,
                p.max_stock,
                p.cooldown

            FROM pokeball_users pu

            INNER JOIN pokeballs p
                ON p.id = pu.pokeball_id

            WHERE pu.user_id = ?
            `,
            [user_id]
        );

        const now = Date.now();

        return pokeballs.map(pokeball => {

            let remainingTime = "---";

            if (pokeball.quantity < pokeball.max_stock) {

                const elapsed =
                    now - pokeball.last_used_at;

                const cooldown =
                    pokeball.cooldown * 60 * 60 * 1000;

                const remaining =
                    Math.max(0, cooldown - elapsed);

                const heures =
                    remaining / (60 * 60 * 1000);

                if (heures >= 1) {

                    remainingTime =
                        `${heures.toFixed(2)} heures restantes`;

                }
                else {

                    const minutes =
                        remaining / (60 * 1000);

                    if (minutes >= 1) {

                        remainingTime =
                            `${minutes.toFixed(2)} minutes restantes`;

                    }
                    else {

                        const secondes =
                            remaining / 1000;

                        remainingTime =
                            `${secondes.toFixed(2)} secondes restantes`;

                    }
                }
            }

            return {
                ...pokeball,
                remaining_time: remainingTime
            };
        });
}

    async create(user_id, pokeball_id, quantity = 0) {
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

    async use(user_id, pokeball_id, quantity = 1) {
        await this.setStockPokeball(user_id);

        const result = await this.query(
            `
            UPDATE pokeball_users
            SET quantity = quantity - ?
            WHERE user_id = ?
            AND pokeball_id = ?
            AND quantity >= ?
            `,
            [
                quantity,
                user_id,
                pokeball_id,
                quantity
            ]
        );
        return result.affectedRows > 0;
    }

}