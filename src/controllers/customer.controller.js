import { db } from "../database/database.js";
import pg from "pg";

export async function getCustomers(req, res) {
    try {
        const customersList = await db.query("SELECT * FROM customers");
        res.status(200).send(customersList.rows);
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor. Por favor, tente novamente mais tarde.");
    };
};