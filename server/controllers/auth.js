const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');

const User = require('../models/userModels');
const Helpers = require('../Hellpers/helper');

module.exports = {
   async CreateUser(req, res) {
        const schema = Joi.object({
            username: Joi.string()
                .min(6)
                .max(30)
                .required(),
            email: Joi.string()
                .min(6)
                .max(30)
                .required()
                .email(),
            password: Joi.string()
                .min(6)
                .max(30)
                .required() });

        const {error, value} = schema.validate(req.body);
       console.log(value);
        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({message: error.details});
        }

       const userEmail = await User.findOne({email: Helpers.lowerCase( req.body.email)});
       if (userEmail) {
           return res.status(HttpStatus.CONFLICT).json({message: 'Email already exist'});
       }
       const userName = await User.findOne({username: Helpers.firstUpper( req.body.username)});
       if (userName) {
           return res.status(HttpStatus.CONFLICT).json({message: 'Username already exist'});
       }

       return  bcrypt.hash(value.password, 10, (err,  hash) => {
           if (err) {
               return res.status(HttpStatus.BAD_REQUEST).json({message: 'Error hashing password'});
           }
           const body = {
               userName: Helpers.firstUpper(value.userName),
               email: Helpers.lowerCase(value.email),
               password: hash
           };
           User.create(body).then((user) => {
               res.status(HttpStatus.CREATED).json({message: 'User created successfully', user})
           }).catch(err => {
               res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error save to db'})
           });
       })
    }
};

