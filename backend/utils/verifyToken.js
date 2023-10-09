require('dotenv').config()
const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const token = req.headers['Authorization']
    if (!token) {
        return res.status(401).send('Unauthorized.')
    }

    jwt.verify(token, jwtKey, (err, user) => {
        if (err) {
            return res.status(403).send('Token expired.')
        }
        req.user = user;
        next();
    });
}

module.exports = verifyToken;