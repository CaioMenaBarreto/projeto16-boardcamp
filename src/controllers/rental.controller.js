import { db } from "../database/database.js";
import pg from "pg";

export async function getRentals(req, res) {
    try {
        const rentalsList = await db.query("SELECT * FROM rentals");
        res.status(200).send(rentalsList.rows);
    } catch(error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor. Por favor, tente novamente mais tarde.");
    };
};