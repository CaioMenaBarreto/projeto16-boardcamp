import { Router } from "express";
import insertGame from "../schemas/game.schema.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import { getGames, postGame } from "../controllers/game.controller.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);
gameRouter.post("/games", schemaValidation(insertGame), postGame);

export default gameRouter;