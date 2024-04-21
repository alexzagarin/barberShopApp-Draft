const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate users via JSON Web Tokens (JWT).
 * This function assumes the JWT token is provided in the Authorization header
 * in the format "Bearer [token]".
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Function} next - The next middleware function in the stack.
 */
const authenticate = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user to the request object
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = { authenticate };
