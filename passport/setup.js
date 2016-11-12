// for everything that Passport needs
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

exports.setup = function() {
  // all of the passport config
  // anytime someone tells you to use the local Strategy, you should look up the values, and then run the function with those values to validate
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, findAndComparePassword)); // no parenthesis so that the function isn't run at this time

  // converts a user to a user id
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
};

function findAndComparePassword(username, password, done) {// 'done' helps us hook into password stuff
  // look up user by username
  //findOne will return one, because there shouldn't be duplicates
  User.findByUsername(username).then(function(user) {
    // if user is not found
    if(!user) {
      // did not find a user, not a successful login
      return done(null, false);
    }
    // compare passwords
    User.comparePassword(user, password).then(function(isMatch) {
      if (isMatch) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }).catch(function(err) {
    console.log('Error finding user', err);
    done(err);
  });
}
