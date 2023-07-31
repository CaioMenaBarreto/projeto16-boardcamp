import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;
const configDatabase = {
    connectionString: process.env.DATABASE_URL
};

if (process.env.NODE_ENV === "production") configDatabase.ssl = true;

console.log("Conexão bem-sucedida com o banco de dados!");

export const db = new Pool(configDatabase);