import { Router } from "express";
import { getRentals } from "../controllers/rental.controller.js";


const rentalRoutes = Router();

rentalRoutes.get("/rentals", getRentals);

export default rentalRoutes;