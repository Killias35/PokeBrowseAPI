import express from "express";

import {
    pokemonsRepo,
    userPokemonsRepo,
    usersRepo
}
from "../repositories.js";

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        const data =
            await pokemonsRepo.getAll();

        res.json({
            success: true,
            pokemons: data
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
POST /pokemon/capture
*/

router.post("/capture", async (req, res) => {

    try {

        const {
            username,
            identifiant,
            pokemonId,
            isShiny,
            domainName
        } = req.body;

        if (!username || !identifiant || !pokemonId) {

            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });

        }

        const connected = await usersRepo.isConnected(username, identifiant);
        if (!connected) {

            return res.status(401).json({
                success: false,
                message: "Mauvais identifiant ou Username"
            });
        }
        const user = await usersRepo.getByUsername(username);

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

router.get("/capture/:username", async (req, res) => {
    try {
        const username = req.params.username;
        if (!username) {

            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        const user = await usersRepo.getByUsername(username);
        if (!user) {

            return res.status(404).json({
                success: false,
                message: "Unknown user"
            });
        }
        const captures = await userPokemonsRepo.getUserCaptures(user.id);

        res.json({
            success: true,
            captures
        });

    }
    catch(error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error
        });

    }
})

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


router.delete("/free/", async (req, res) => {

    try {

        const {
            username,
            identifiant
        } = req.body;

        if (!username && !identifiant) {

            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }
        if (!await usersRepo.isConnected(username, identifiant)) {

            return res.status(401).json({
                success: false,
                message: "Mauvais identifiant ou Username"
            });
        }

        const user = await usersRepo.getByUsername(username);
        const ret = await userPokemonsRepo.freePokemons(user.id);

        res.json({
            success: true,
            freed: ret
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