import app from "./app.js";
import dotenv from "dotenv";
import { scheduleNextEncounters } from "./services/createEncounters.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});

scheduleNextEncounters();