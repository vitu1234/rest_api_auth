const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/',verify, (req, res) => {
    // res.json({post:'post auth', description: 'logged in post'})
    res.send(req.user)
});

module.exports = router