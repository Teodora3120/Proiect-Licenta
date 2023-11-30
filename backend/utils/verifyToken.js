require('dotenv').config()
const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).send('Unauthorized.');
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).send('Invalid token format.');
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