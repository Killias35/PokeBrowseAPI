import express from "express";
import { usersRepo, sessionRepo, hashPassword } from "../repositories.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const data =
            await usersRepo.getAll();

        res.json({
            success: true,
            users: data
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
POST /users/register
*/

router.post("/register", async (req, res) => {

    try {
        let {
            image,
            username,
            description,
            identifiant
        } = req.body;
        identifiant = await hashPassword(identifiant);

        if (!username || !description || !identifiant || !image) {

            return res.status(400).json({
                success: false,
                message: "Missing username or description or identifiant or image"
            });

        }

        let existUsername = await usersRepo.getByUsername(username);
        if (existUsername) {

            return res.status(409).json({
                success: false,
                message: "Username déjà utilisé"
            });
        }

        const user_id = await usersRepo.create(image, username, description, identifiant);
        const token = await sessionRepo.create(user_id);

        res.json({
            success: true,
            user_id,
            token
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

router.patch("/", async (req, res) => {

    try {

        let {
            image,
            username,
            description,
            identifiant
        } = req.body;
        
        if (!username && !description && !image) {

            return res.status(400).json({
                success: false,
                message: "Rien à mettre à jour"
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
        const updated = await usersRepo.update(user.id, image, username, description);

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

router.post("/login", async (req, res) => {

    try {

        let {
            username,
            identifiant
        } = req.body;
        if (!identifiant || !username) {

            return res.status(400).json({
                success: false,
                message: "Missing username or identifiant"
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
        const token = await sessionRepo.refreshToken(user.id);
        res.json({
            success: true,
            user,
            token
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