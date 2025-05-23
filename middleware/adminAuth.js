// import { configDotenv } from "dotenv"; if admin_api_key does not loads

const adminAuthMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.ADMIN_API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(403).json({ message: 'Access denied. Invalid API key.' });
    }

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
};

export default adminAuthMiddleware;
