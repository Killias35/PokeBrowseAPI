import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import userRoutes from "./routes/users.routes.js";
import pokemonRoutes from "./routes/pokemon.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import encoutersRoutes from "./routes/encouters.routes.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/pokemon", pokemonRoutes);
app.use("/encouters", encoutersRoutes);
app.use("/", leaderboardRoutes);

app.get("/status", (req, res) => {

    res.json({
        success: true,
        status: "online"
    });

});

export default app;