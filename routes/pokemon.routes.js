import express from "express";

import {
    pokemonsRepo,
    userPokemonsRepo,
    usersRepo
}
from "../repositories.js";

const router = express.Router();

/*
POST /pokemon/capture
*/

router.post("/capture", async (req, res) => {

    try {

        const {
            identifiant,
            pokemonId,
            isShiny,
            domainName
        } = req.body;

        if (!identifiant || !pokemonId) {

            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });

        }

        const user =
            await usersRepo.getByIdentifiant(
                identifiant
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "Unknown user"
            });

        }

        const pokemon =
            await pokemonsRepo.getById(
                pokemonId
            );

        if (!pokemon) {

            return res.status(404).json({
                success: false,
                message: "Unknown pokemon"
            });

        }

        const captureId =
            await userPokemonsRepo.capture(
                user.id,
                pokemonId,
                isShiny || false,
                domainName || null
            );

        res.json({
            success: true,
            captureId
        });

    }
    catch(error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

/*
GET /pokemon/:id
*/

router.get("/:id", async (req, res) => {

    try {

        const pokemon =
            await pokemonsRepo.getById(
                req.params.id
            );

        if (!pokemon) {

            return res.status(404).json({
                success: false
            });

        }

        res.json({
            success: true,
            pokemon
        });

    }
    catch(error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

export default router;