import express from "express";
import { usersRepo } from "../repositories.js";

const router = express.Router();

/*
POST /users/register
*/

router.post("/register", async (req, res) => {

    try {
        const {
            username,
            description,
            identifiant
        } = req.body;

        if (!username || !description || !identifiant) {

            return res.status(400).json({
                success: false,
                message: "Missing username or description or identifiant"
            });

        }

        const existing =
            await usersRepo.getByIdentifiant(
                identifiant
            );

        if (existing) {

            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }

        const id =
            await usersRepo.create(
                username,
                description,
                identifiant
            );

        res.json({
            success: true,
            id
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
GET /users/:id
*/

router.get("/:id", async (req, res) => {

    try {

        const user =
            await usersRepo.getById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({
                success: false
            });

        }

        res.json({
            success: true,
            user
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});


router.get("/search/:username", async (req, res) => {

    try {

        const username = req.params.username;
        const user = await usersRepo.getByUsername(username);
        if (!user) {

            return res.status(404).json({
                success: false
            });

        }

        res.json({
            success: true,
            user
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

router.patch("/:identifiant", async (req, res) => {

    try {

        const identifiant = req.params.identifiant;

        const {
            username,
            description
        } = req.body;

        if (!username && !description) {

            return res.status(400).json({
                success: false,
                message: "Nothing to update"
            });

        }

        const existing = await usersRepo.getByIdentifiant(identifiant);

        if (!existing) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const updated = await usersRepo.update(identifiant, username, description);

        res.json({
            success: true,
            updated
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