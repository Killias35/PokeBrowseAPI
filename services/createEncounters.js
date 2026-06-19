import { usersRepo, encountersUserRepo, spawnRepo } from "../repositories.js";
import { MAX_SPAWNS, MAX_TIME_BEFORE_SPAWN } from "../repositories/SpawnUtils.js";


function getRandomDelay() {
    return Math.floor(
        MAX_TIME_BEFORE_SPAWN * (0.5 + Math.random() * 0.5)
    );
}

export async function scheduleNextEncounters() {
    const delay = getRandomDelay();
    setTimeout(async () => {
        try {
            await createEncounters();
        }
        catch (error) {
            console.error(error);
        }
        // Programme le suivant avec un nouveau délai
        scheduleNextEncounters();
    }, delay);
}

async function createEncounters() {
    const users = await usersRepo.getAll();
    for(const user of users){
        const encounter = await encountersUserRepo.get(user.id);
        const spawned   = await spawnRepo.getAllSpawned(user.id);
        const total = encounter.length + spawned.length;
        if(total < MAX_SPAWNS){
            await encountersUserRepo.create(user.id);
            // console.log("ajout d'une rencontre possible pour", user.username, 'total', total + 1);
        }
    }

    // on supprime les anciennes rencontres expirés
    await spawnRepo.deleteTooOld();
    await encountersUserRepo.deleteTooOld();
}