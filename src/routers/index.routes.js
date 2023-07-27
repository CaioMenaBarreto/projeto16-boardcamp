import { Router } from "express";
import gameRouter from "./games.routes.js";
import rentalRoutes from "./rentals.routes.js";
import customerRoutes from "./customers.routes.js";

const router = Router();

router.use(gameRouter);
router.use(rentalRoutes);
router.use(customerRoutes);

export default router;