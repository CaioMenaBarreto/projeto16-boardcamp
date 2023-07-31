import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    try {
        const query = `
            SELECT rentals.id, rentals."customerId", rentals."gameId", rentals."rentDate", rentals."daysRented", rentals."returnDate", rentals."originalPrice", rentals."delayFee",
                c.id as "customer.id", c.name as "customer.name",
                g.id as "game.id", g.name as "game.name"
            FROM rentals
            LEFT JOIN customers c ON rentals."customerId" = c.id
            LEFT JOIN games g ON rentals."gameId" = g.id
            ORDER BY rentals.id ASC;
        `;

        const rentalsList = await db.query(query);

        const formattedRentalsList = rentalsList.rows.map((rental) => {
            const formattedRental = {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
                daysRented: rental.daysRented,
                returnDate: rental.returnDate !== null ? dayjs(rental.returnDate).format("YYYY-MM-DD") : null,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental["customer.id"],
                    name: rental["customer.name"],
                },
                game: {
                    id: rental["game.id"],
                    name: rental["game.name"],
                },
            };

            return formattedRental;
        });

        res.status(200).send(formattedRentalsList);
    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor:", error.message);
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    try {
        const customer = await db.query("SELECT id FROM customers WHERE id = $1", [customerId]);
        if (customer.rows.length === 0) {
            return res.status(400).send("Cliente não encontrado.");
        }

        const game = await db.query('SELECT id, "stockTotal", "pricePerDay" FROM games WHERE id = $1', [gameId]);
        if (game.rows.length === 0) {
            return res.status(400).send("Jogo não encontrado.");
        }

        const stockTotal = game.rows[0].stockTotal;
        const pricePerDay = game.rows[0].pricePerDay;

        const rentalsInOpen = await db.query('SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [gameId]);
        const gamesRented = rentalsInOpen.rows[0].count;

        if (gamesRented >= stockTotal) {
            return res.status(400).send("Não há jogos disponíveis para alugar.");
        };

        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = daysRented * pricePerDay;
        const returnDate = null;
        const delayFee = null;

        await db.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        res.sendStatus(201);

    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor:", error.message);
    };
};

export async function postRentalsReturn(req, res) {
    const { id } = req.params;
    try {
        const returnRental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if (returnRental.rows.length === 0) {
            return res.status(404).send("Aluguel não encontrado.");
        }

        if (returnRental.rows[0].returnDate !== null) {
            return res.status(400).send("Este aluguel já foi devolvido anteriormente.");
        }

        const rentDate = dayjs(returnRental.rows[0].rentDate);
        const daysRented = returnRental.rows[0].daysRented;
        const expectedReturnDate = rentDate.add(daysRented, "day");
        const today = dayjs();

        let delayDays = 0;
        if (today.isAfter(expectedReturnDate)) {
            delayDays = today.diff(expectedReturnDate, "day");
        }

        const gameValue = returnRental.rows[0].originalPrice / returnRental.rows[0].daysRented;
        const delayFee = delayDays > 0 ? delayDays * gameValue : null;

        await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3', [today.format("YYYY-MM-DD"), delayFee, id]);
        res.sendStatus(200);

    } catch (error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor:", error.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        const rental  = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

        if(!rental.rows[0]) {
            return res.status(404).send("Aluguel inexistente.");
        };

        if(rental.rows[0].returnDate === null) {
            return res.status(400).send("Aluguel não finalizado.");
        }
        
        await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.sendStatus(200);

    } catch(error) {
        console.error("Erro no servidor:", error.message);
        return res.status(500).send("Erro no servidor:", error.message);
    }
}