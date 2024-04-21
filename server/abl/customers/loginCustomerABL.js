const jwt = require('jsonwebtoken');
const customersDao = require('../../dao/customersDao');

async function loginCustomer(req, res) {
    const { email, password } = req.body;
    console.log("Logging in with:", email, password); // Check input

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const customer = await customersDao.findByEmail(email);
        if (!customer) {
            console.log("No user found for email:", email);
            return res.status(404).json({ message: "User not found." });
        }

        console.log("User found, checking password..."); // Confirm user found
        if (password !== customer.password) {  // Compare plain text passwords directly
            console.log("Password mismatch for user:", email);
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { customerId: customer.id, email: customer.email },
            process.env.JWT_SECRET || 'your_secret_key_here',
            { expiresIn: '24h' }
        );

        console.log("Login successful, token generated for:", email);
        return res.status(200).json({ token: token, message: "Login successful." });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = loginCustomer;
