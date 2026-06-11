import express from "express";

import {
    leaderboardsRepo
}
from "../repositories.js";

const router = express.Router();

/*
GET /leaderboard1
Pokemon uniques
*/

router.get("/leaderboard1", async (req, res) => {

    try {

        const data =
            await leaderboardsRepo.uniquePokemon();

        res.json({
            success: true,
            leaderboard: data
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
GET /leaderboard2
Total captures
*/

router.get("/leaderboard2", async (req, res) => {

    try {

        const data =
            await leaderboardsRepo.totalCaptures();

        res.json({
            success: true,
            leaderboard: data
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
GET /leaderboard3
Shiny captures
*/

router.get("/leaderboard3", async (req, res) => {

    try {

        const data =
            await leaderboardsRepo.shinyCaptures();

        res.json({
            success: true,
            leaderboard: data
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