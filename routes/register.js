const router = require('express').Router();
const User = require('../models/user');

router.post('/', function(req, res) {
  console.log('registering new user');
  // in production, never store passwords in plain text
  const user = new User({username: req.body.username, password: req.body.password});
  user.save().then(function() {
    res.sendStatus(201);
  }).catch(function(err){
    console.log('Error in /register', err);
    res.sendStatus(500);
  });
});

module.exports = router;
