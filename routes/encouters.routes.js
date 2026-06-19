import express from "express";

import {
    pokemonsRepo,
    userPokemonsRepo,
    usersRepo,
    sessionRepo
}
from "../repositories.js";
import { auth } from "../middleware/auth.js";

const router = express.Router()

router.post("/spawned", async (req, res) => {

    try {

        const {
            username,
            identifiant,
            domainName
        } = req.body;

        if (!username || !identifiant) {

            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        const user = await usersRepo.getByUsername(username);
        if (!user) {

            return res.status(404).json({
                success: false,
                message: "Utilisateur inconnu"
            });
        }

        const connected = await sessionRepo.chekToken(user.id, identifiant);
        if (!connected) {

            return res.status(401).json({
                success: false,
                message: "Mauvais identifiant ou Username"
            });
        }

        const ret = await userPokemonsRepo.spawnedPokemons(user.id, domainName);

        res.json({
            success: true,
            spawned: ret
        });

    }
    catch(error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

export default router