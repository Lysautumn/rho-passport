const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//try not to use more than 11, it will take a long time
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// before a user tries to save their info, run this function, the password gets hashed
userSchema.pre('save', function(done) {
  // user can't be reassigned
  const user = this;
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
    if (err) {
      console.log('Error hashing password', err);
      return done(new Error('Error hashing password'));// make sure to add this!
    }
    user.password = hash;
    done();
  });
});

userSchema.methods.comparePassword = function(password) {
  const user = this;
  return new Promise(function(resolve) {
    bcrypt.compare(password, user.password, function(err, match) {
      if (err) {
        console.log('Error comparing password', err);
        return resolve(false);
      }
      resolve(match);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
