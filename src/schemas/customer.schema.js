import joi from "joi";

const schemaCustomer = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
    cpf: joi.string().min(11).max(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.date().iso().required()
});

export default schemaCustomer;