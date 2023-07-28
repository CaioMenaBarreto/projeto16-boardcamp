import { Router } from "express";
import schemaValidation from "../middlewares/schemaValidation.js";
import schemaCustomer from "../schemas/customer.schema.js";
import { postCustomer, getCustomerId, putCustomer, getCustomers } from "../controllers/customer.controller.js";

const customerRoutes = Router();

customerRoutes.get("/customers", getCustomers);
customerRoutes.post("/customers", schemaValidation(schemaCustomer), postCustomer);
customerRoutes.get("/customers/:id", getCustomerId);
customerRoutes.put("/customers/:id",schemaValidation(schemaCustomer) ,putCustomer);

export default customerRoutes;