import joi from "joi";

const insertGame = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().positive().required(),
    pricePerDay: joi.number().positive().required()
});


export default insertGame;