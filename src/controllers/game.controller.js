import { db } from "../database/database.js";
import pg from "pg";

export async function getGames(req, res) {
    try {
        const gamesList = await db.query("SELECT * FROM games");
        res.status(200).send(gamesList.rows);
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor:", error.message);
    };
};

export async function postGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
        const jogoExistente = await db.query("SELECT * FROM games WHERE name = $1", [name]);
        if (jogoExistente.rows.length > 0) {
            return res.status(409).send("Já existe um jogo com esse nome.");
        };

        await db.query('INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)', [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor:", error.message);
    };
};