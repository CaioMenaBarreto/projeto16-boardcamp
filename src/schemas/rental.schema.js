import joi from "joi";

const insertRental = joi.object({
    customerId: joi.number().positive().required(),
    gameId: joi.number().positive().required(),
    daysRented: joi.number().positive().required()
});

export default insertRental;