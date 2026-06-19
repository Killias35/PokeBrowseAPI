import express from "express";

import { spawnRepo, encountersUserRepo, usersRepo } from "../repositories.js";
import { MAX_SPAWNS } from "../repositories/SpawnUtils.js";
import { auth } from "../middleware/auth.js";
import UserEncouters from "../repositories/UserEncouters.js";

const router = express.Router()

router.post("/spawned", auth, async (req, res) => {
    // obtient combien de pokemons peuvent apparaitre et fais apparaitre ces pokemons si possible
    // retourne ensuite tout les pokemons qui ont spawn
    try {

        const {
            domainName
        } = req.body;

        if (!domainName) {

            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        await encountersUserRepo.deleteTooOld();
        await spawnRepo.deleteTooOld();

        const spawned = await spawnRepo.getAllSpawned(req.user.id);
        if(spawned.length < MAX_SPAWNS) {
            const canSpawn = await encountersUserRepo.get(req.user.id);
            for (const encounter of canSpawn) {
                await spawnRepo.spawn(req.user.id, domainName, encounter.expires_at);
                await encountersUserRepo.delete(encounter.id);
            }
        }

        usersRepo.refreshLastActivity(req.user.id);
        const ret = await spawnRepo.getSpawned(req.user.id, domainName);

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