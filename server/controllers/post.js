const HttpStatus = require('http-status-codes');
const Joi = require('joi');

const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = {
    AddPost(req, res) {
        const schema = Joi.object({
            post: Joi.string()
                .required()
        });
        const {error, value} = schema.validate(req.body);
        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({msg: error.details});
        }

        const body = {
            user: req.user._id,
            username: req.user.username,
            post: req.body.post,
            created: new Date()
        };

        Post.create(body).then(async (post) => {
            await User.update({
                _id: req.user._id
            },{
                $push: {posts: {
                        postId: post._id,
                        post: req.body.post,
                        created: new Date()
                    }}
            });
            res.status(HttpStatus.CREATED).json({message:  'Post created', post})
        }).catch(error => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error occurred'
            })
        });
    },

    async GetAllPosts(reg, res) {
        try {
            const posts = await Post.find({})
                .populate('user')
                .sort({created: -1});
            return res.status(HttpStatus.OK).json({message: 'All posts', posts})
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occurred'})
        }
    },

    async AddLike(req, res) {

        const postId = req.body._id;
        await Post.update({
            _id: postId,
            "likes.username" : {$ne : req.user.username}
        }, {
            $push: {likes: {
                    username: req.user.username
                }},
            $inc: {totalLikes: 1}
        })
            .then(() => {
                res.status(HttpStatus.OK).json({message: 'You liked the post'})
            }).catch((error) => {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occurred'})
            });
    },

    async AddComment(req, res) {
        const postId = req.body.postId;
        await Post.updateOne({
            _id: postId,
        }, {
            $push: {comments: {
                    userID: req.user._id,
                    username: req.user.username,
                    comment: req.body.comment.comment,
                    createdAt: new Date()
                }}
        })
            .then(() => {
                res.status(HttpStatus.OK).json({message: 'Comment addded top post'})
            }).catch((error) => {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occurred'})
            });
    },

    async GetPost(req, res) {
        await Post.findOne({_id: req.params.id})
            .populate('user')
            .populate('comments.userId')
            .then((post) => {
                res.status(HttpStatus.OK).json({message: 'Post found', post})
            }).catch(error => {
                return res.status(HttpStatus.NOT_FOUND).json({message: 'Post not found'})
            });
    }
};
