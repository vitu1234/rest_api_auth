const router = require('express').Router()
const User = require('../model/User')
const {body, validationResult} = require('express-validator');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv= require('dotenv')
dotenv.config()

router.post('/register',
    // username must be an email
    body('name').isLength({min: 4}),
    body('email').isEmail(),
    // password must be at least 5 chars long
    // body('password').custom(value =>{
    //     if (value.length < 5){
    //         return Promise.reject('password too short');
    //     }
    // }),
    body('email').custom(value => {
        return User.findOne({email: value}).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
    }),
    async (req, res) => {

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }


        //HASH PASSWORD
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);


        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        //check if exists


        try {
            const saveUser = await user.save();
            res.status(200).send({user: user._id})
        } catch (err) {
            res.status(400).send(err)
        }

    });

router.post('/login',
    body('email').isEmail(),
    body('password').isEmpty(),
    // password must be at least 5 chars long
    // body('password').custom(value =>{
    //     if (value.length < 5){
    //         return Promise.reject('password too short');
    //     }
    // }),
    body('email').custom(value => {
        return User.findOne({email: value}).then(user => {
            if (!user) {
                return Promise.reject('E-mail or password is wrong');
            }
        });
    }),
    async (req, res) => {
        const user = await User.findOne({email: req.body.email});
        if (user !== null){
            const verified = bcryptjs.compareSync(req.body.password, user.password); // true
            if (verified) {

                //CREATE AND ASSIGN A TOKEN
                const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
                res.header('auth-token',token).send(token);
            } else {
                res.status(401).send({msg: 'Email or password is wrong'});
            }
        }else{
            res.status(401).send({msg: 'Email or password is wrong'});
        }

    })

module.exports = router