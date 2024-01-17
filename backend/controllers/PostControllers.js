const db = require('../models');
const Posts = db.Posts;
const Users = db.Users;

const { Op } = require('sequelize');

require('dotenv').config();

const { commonPostResponseParserMap } = require('../parser/postResponseParser');


const getPostByUsername = async (req, res) => {
    const username = req.params.username;
    let page = req.query.page || 1;
    let perPage = req.query.limit || 10;
    try {
        const posts = await Posts.findAll({
            include: [{
                model: Users,
                where: { username: username },
                attributes: ['id', 'username', 'name', 'avatar'],
            }],
            attributes: ['post_id', 'content', 'createdAt'],
            limit: perPage,
            offset: (page - 1) * perPage,
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).send(commonPostResponseParserMap(posts));
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while getting posts',
        });
    }
}



const getAllPost = async (req, res) => {
    let page = req.query.page || 1;
    let perPage = req.query.limit || 10;
    try {
        const posts = await Posts.findAll({
            include: [{
                model: Users,
                attributes: ['id', 'username', 'name', 'avatar'],
            }],
            attributes: ['post_id', 'content', 'createdAt'],
            limit: perPage,
            offset: (page - 1) * perPage,
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).send(commonPostResponseParserMap(posts));
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while getting posts',
        });
    }
}

const getSearchPost = async (req, res) => {
    let query = req.query.q;
    let page = req.query.page || 1;
    let perPage = req.query.limit || 10;
    const keywords = query.split(' ');
    try {
        const posts = await Posts.findAll({
            include: [{
                model: Users,
                attributes: ['id', 'username', 'name', 'avatar'],
            }],
            where: {
                [Op.and]: keywords.map(keyword => ({
                    [Op.or]: [
                        {
                            '$User.username$': {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },
                        {
                            '$User.name$': {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },
                        {
                            content: {
                                [Op.iLike]: `%${keyword}%`,
                            },
                        },
                    ],
                })),
            },
            attributes: ['post_id', 'content', 'createdAt'],
            limit: perPage,
            offset: (page - 1) * perPage,
            order: [['createdAt', 'DESC']],
        });
        return res.status(200).send(commonPostResponseParserMap(posts));
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while getting posts',
        });
    }
}


const createPost = async (req, res) => {
    const user_id = req.user_id;
    console.log(user_id);
    const createPostBody = {
        user_id: user_id,
        content: req.body.content,
    };
    try {
        const createdPost = await Posts.create(createPostBody);
        //TODO: Response ID or create que for storage
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Error while creating post',
        });
    }
}

module.exports = {
    getPostByUsername,
    getSearchPost,
    getAllPost,
    createPost
}