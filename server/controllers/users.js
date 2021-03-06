const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
   async GetAllUsers(req, res) {
       await User.find({})
           .populate('posts.postsId')
           .then((result) => {
               res.status(HttpStatus.OK).json({message: 'All users', result});
           }).catch(error => {
               res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occurred'});
           })
    }
};
