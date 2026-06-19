import { usersRepo, sessionRepo } from "../repositories.js";

export async function auth(req, res, next) {

    try {

        const {
            identifiant
        } = req.body;

        if (!identifiant) {

            return res.status(400).json({
                success: false,
                message: "Missing authentication fields"
            });
        }

        const connected = await sessionRepo.chekToken(
            identifiant
        );
        if (!connected) {

            return res.status(401).json({
                success: false,
                message: "Mauvais identifiant"
            });
        }

        const user = await usersRepo.getById(connected.user_id);

        // Disponible dans les routes suivantes
        req.user = user;

        next();

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });

    }

}
