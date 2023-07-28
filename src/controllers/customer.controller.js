import { db } from "../database/database.js";
import pg from "pg";

export async function getCustomers(req, res) {
    try {
        const customersList = await db.query("SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers");
        res.status(200).send(customersList.rows);
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor. Por favor, tente novamente mais tarde.");
    };
};

export async function getCustomerId(req, res) {
    const { id } = req.params;
    try {
        const idExistente = await db.query("SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers WHERE id = $1", [id]);
        if (!idExistente.rows[0]) {
            return res.status(404).send("O cliente não existe.");
        };

        res.status(200).send(idExistente.rows);

    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor. Por favor, tente novamente mais tarde.");
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const cpfExistente = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if (cpfExistente.rows.length > 0) {
            return res.status(409).send("Cliente já existente.");
        };

        await db.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        res.sendStatus(201);

    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor. Por favor, tente novamente mais tarde.");
    };
};

export async function putCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    try {
        const clienteExistente = await db.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        const clienteAtual = await db.query('SELECT * FROM customers WHERE id = $1', [id]);

        if(clienteExistente.rows.length > 0 && clienteExistente.rows[0].id !== Number(id)){
            return res.status(409).send("Esse cliente já existe.");
        }

        if(clienteAtual.rows.length === 0){
            return res.status(404).send("Cliente não encontrado.");
        }

        await db.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
        
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor. Por favor, tente novamente mais tarde.");
    };
};