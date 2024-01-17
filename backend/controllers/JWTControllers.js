const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (id, refresh = false) => {
    const data = {
        id: id
    };
    const accessToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_MINUTES + 'm' });
    if (refresh) {
        const refreshToken = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_DAYS + 'd' });
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
    return {
        access_token: accessToken
    };
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (e) {
        return false;
    }
}

const verifyAccessToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(405).json({ error: 'Token not provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid token' });
    } else {
        req.user_id = decoded.id;
        return next();
    }
};

const grantNewAccessToken = (req, res) => {
    const cookies = req.cookies['refresh_token'];
    if (!cookies) {
        return res.status(405).json({ error: 'Cookie not provided' });
    }
    const decoded = verifyToken(cookies);
    if (!decoded) {
        return res.status(401).send({ error: 'Invalid token' });
    }
    const newToken = createToken(decoded.id, false);
    return res.status(200).send({ access_token: newToken.access_token });
}

const userLogout = (req, res) => {
    const cookies = req.cookies['refresh_token'];
    if (!cookies) {
        return res.status(405).json({ error: 'Cookie not provided' });
    }
    res.clearCookie('refresh_token');

    return res.sendStatus(204);
}

module.exports = {
    createToken,
    verifyToken,
    verifyAccessToken,
    grantNewAccessToken,
    userLogout
}
