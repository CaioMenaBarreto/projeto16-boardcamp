import { Router } from "express";
import { getRentals, postRentals, postRentalsReturn, deleteRental } from "../controllers/rental.controller.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import rentalSchema from "../schemas/rental.schema.js";

const rentalRoutes = Router();

rentalRoutes.get("/rentals", getRentals);
rentalRoutes.post("/rentals", schemaValidation(rentalSchema), postRentals);
rentalRoutes.post("/rentals/:id/return", postRentalsReturn);
rentalRoutes.delete("/rentals/:id", deleteRental);

export default rentalRoutes;