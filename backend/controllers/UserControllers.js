const db = require('../models');
const Users = db.Users;

const JWTControllers = require('./JWTControllers');
const { Op } = require('sequelize');

require('dotenv').config();

const { myProfileResponseParser, commonProfileResponseParser, commonProfileResponseParserMap } = require('../parser/userResponseParser');

const userRegister = async (req, res) => {
    const registerUserReqBody = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        avatar: req.body.avatar,
        bio: req.body.bio,
        birthdate: new Date(req.body.birthdate),
    };

    try {
        const existingUsername = await Users.findOne({
            where: { username: registerUserReqBody.username }
        });
        if (existingUsername) {
            return res.status(409).send({
                error: 'Username already exists'
            });
        }
        const existingEmail = await Users.findOne({
            where: { email: registerUserReqBody.email }
        });
        if (existingEmail) {
            return res.status(409).send({
                error: 'Email already exists'
            });
        }
        const createdUser = await Users.create(registerUserReqBody);
        const token = JWTControllers.createToken(createdUser.id, true);
        res.cookie('refresh_token', token.refresh_token, {
            maxAge: process.env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
            httpOnly: true
        });
        res.status(200).send({
            access_token: token.access_token,
            uid: createdUser.id,
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while registering user',
        });
    }
};

const userLogin = async (req, res) => {
    const loginUserReqBody = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        const user = await Users.findOne({
            where: { email: loginUserReqBody.email },
        })
        if (!user) {
            return res.status(401).send({
                error: 'Authentication failed',
            });
        }
        user.checkPassword(loginUserReqBody.password, (error, isMatch) => {
            if (isMatch && !error) {
                const token = JWTControllers.createToken(user.id, true);
                res.cookie('refresh_token', token.refresh_token, {
                    maxAge: process.env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
                    httpOnly: true
                });
                res.status(200).send({
                    access_token: token.access_token,
                    uid: user.id,
                });
            } else {
                return res.status(401).send({
                    error: 'Authentication failed',
                });
            }
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while login user',
        });
    }
}

const getMyProfile = async (req, res) => {
    const user_id = req.user_id;
    try {

        const user = await Users.findOne({
            where: { id: user_id },
            attributes: {
                exclude: ['password'],
            },
        });
        if (!user) {
            return res.status(404).send({
                error: 'No user founded',
            });
        }
        return res.status(200).send(myProfileResponseParser(user));
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while searching user',
        });
    }
}

const getProfileByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await Users.findOne({
            where: { username: username },
            attributes: ['id', 'username', 'name', 'avatar', 'bio', 'createdAt'],
        });
        if (!user) {
            return res.status(404).send({
                error: 'No user founded',
            });
        }
        return res.status(200).send(commonProfileResponseParser(user));
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while searching user',
        });
    }
}

const getMatchedUsersProfile = async (req, res) => {
    let query = req.query.q;
    let page = req.query.page || 1;
    let perPage = req.query.limit || 10;
    const keywords = query.split(' ');

    try {
        const users = await Users.findAll({
            where: {
                [Op.and]: keywords.map(keyword => ({
                    [Op.or]: [
                        {
                            username: {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },
                        {
                            name: {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },

                    ],
                })),
            },
            attributes: ['id', 'username', 'name', 'avatar', 'bio', 'createdAt'],
            limit: perPage,
            offset: (page - 1) * perPage,
        });
        return res.status(200).send(commonProfileResponseParserMap(users));
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while searching user',
        });
    }
}

const editMyProfile = async (req, res) => {
    const user_id = req.user_id;
    try {
        const updateUserReqBody = {
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            avatar: req.body.avatar,
            bio: req.body.bio,
            birthdate: req.body.birthdate
        };
        for (let k in updateUserReqBody) {
            if (updateUserReqBody[k] == null) {
                delete updateUserReqBody[k];
            }
        }
        const currentThisUser = await Users.findOne({
            where: { id: user_id },
            attributes: ['username', 'email'],
        });
        if (!currentThisUser) {
            return res.status(404).send({
                error: 'No user founded',
            });
        }
        for (let k in updateUserReqBody) {
            if (currentThisUser[k] === updateUserReqBody[k]) {
                delete updateUserReqBody[k];
            }
        }
        if (updateUserReqBody.username != undefined) {
            const existingUsername = await Users.findOne({
                where: { username: updateUserReqBody.username }
            });
            if (existingUsername) {
                return res.status(409).send({
                    error: 'Username already exists'
                });
            }
        }
        if (updateUserReqBody.email != undefined) {
            const existingEmail = await Users.findOne({
                where: { email: updateUserReqBody.email }
            });
            if (existingEmail) {
                return res.status(409).send({
                    error: 'Email already exists'
                });
            }
        }
        if (updateUserReqBody) {
            const user = await Users.update(
                updateUserReqBody, {
                where: { id: user_id }
            });
            if (!user) {
                return res.status(404).send({
                    error: 'No user founded',
                });
            }
        }
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while searching user',
        });
    }
}

const deleteMyAccount = async (req, res) => {
    const user_id = req.user_id;
    try {
        const user = await Users.destroy({
            where: { id: user_id }
        });
        if (!user) {
            return res.status(404).send({
                error: 'No user founded',
            });
        }
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while searching user',
        });
    }
}

module.exports = {
    userRegister,
    userLogin,
    getMyProfile,
    getProfileByUsername,
    getMatchedUsersProfile,
    editMyProfile,
    deleteMyAccount
}