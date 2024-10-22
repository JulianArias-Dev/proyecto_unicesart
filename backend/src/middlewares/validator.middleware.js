import { z } from 'zod';

// Define your schema
const schema = z.object({
  id: z.string().nonempty(), // Example: id must be a non-empty string
  name: z.string().min(2),   // Example: name must have at least 2 characters
});

// Middleware to validate schema
export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Combine the request data from body, params, and query
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        };

        // Validate the combined data using Zod
        schema.parse(data); 
        next();
    } catch (error) {
        console.error('Validation Error:', error);

        // Send a detailed error response if available
        if (error.errors) {
            return res.status(400).json(error.errors.map(e => e.message));
        } else {
            return res.status(400).json({ message: "Error de validación" });
        }
    }
};
