import { Router } from "express";
import { getCustomers } from "../controllers/customer.controller.js";
import schemaValidation from "../middlewares/schemaValidation.js";
import insertCustomer from "../schemas/customer.schema.js";
import { postCustomer, getCustomerId, putCustomer } from "../controllers/customer.controller.js";

const customerRoutes = Router();

customerRoutes.get("/customers", getCustomers);
customerRoutes.post("/customers", schemaValidation(insertCustomer), postCustomer);
customerRoutes.get("/customers/:id", getCustomerId);
customerRoutes.put("/customers/:id", putCustomer);

export default customerRoutes;