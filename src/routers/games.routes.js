import { Router } from "express";
import gameSchema from "../schemas/game.schema.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import { getGames, postGame } from "../controllers/game.controller.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);
gameRouter.post("/games", schemaValidation(gameSchema), postGame);

export default gameRouter;