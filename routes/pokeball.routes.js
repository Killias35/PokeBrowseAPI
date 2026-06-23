import express from "express";

import {
    pokeballsRepo,
    pokeballUsersRepo,
    usersRepo
} from "../repositories.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

/*
GET /pokeballs
*/

router.get("/", async (req, res) => {

    try {

        const pokeballs =
            await pokeballsRepo.getAll();

        res.json({
            success: true,
            pokeballs
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

/*
POST /pokeballs/show
*/

router.post("/show", auth, async (req, res) => {

    try {

        const pokeballs =
            await pokeballUsersRepo.getUserId(
                req.user.id
            );

        usersRepo.refreshLastActivity(req.user.id);

        res.json({
            success: true,
            pokeballs
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

/*
POST /pokeballs/use
*/

router.post("/use", auth, async (req, res) => {

    try {

        const {
            pokeball_id
        } = req.body;

        if (!pokeball_id) {

            return res.status(400).json({
                success: false,
                message: "Missing pokeball_id"
            });

        }

        await pokeballUsersRepo.use(req.user.id, pokeball.id);

        res.json({
            success: true
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

export default router;