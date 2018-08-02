const router = require('express').Router();
const passport =  require('passport');
var { mongoose } = require("./../db/mongoose");
var { User } = require("./../models/user");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const _ = require("lodash");

// auth login 

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        res.status(200).json({
            message: 'Successfully logged in',
            userId: user._id
        });
    });
});

router.post('/signup', (req, res) => {
    console.log('In server signup');
    var body = _.pick(req.body, ['firstName','lastName','email', 'password']);
    var user = new User(body);

    user.save().then(() => user.generateAuthToken()).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


// auth with google
router.get('/google', passport.authenticate('google', {
  scope:['profile']
}));

// callback route for google to redirect to
router.get ('./google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  req.logout();
});

router.get("/xyz", (req, res) => {
  res.status(200).send("Connected auth");
});

module.exports = router; 