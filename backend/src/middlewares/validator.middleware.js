export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Combina los diferentes lugares donde se pueden recibir los datos
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        };

        schema.parse(data); // Valida todos los datos combinados
        next();
    } catch (error) {
        return res.status(400).json(error.errors.map(error => error.message));
    }
};
