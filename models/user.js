//const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//try not to use more than 11, it will take a long time
const SALT_ROUNDS = 10;

const pool = require('../db/connection');
// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String
// });

//////////// SQL
//find by username
function findByUsername(username) {
  return new Promise(function(resolve, reject) {
    pool.connect(function(err, client, done) {
      if(err) {
        done();
        return reject(err);
      }
      client.query('SELECT * FROM users WHERE username=$1', [username], function(err, result) {
        done();
        if(err) {
          reject(err);
        }
        resolve(result.rows[0]);
      });
    });
  });
}
//find by id
function findById(id) {
  return new Promise(function(resolve, reject) {
    pool.connect(function(err, client, done) {
      if(err) {
        done();
        return reject(err);
      }
      client.query('SELECT * FROM users WHERE id=$1', [id], function(err, result) {
        done();
        if(err) {
          reject(err);
        }
        resolve(result.rows[0]);
      });
    });
  });
}
//create
function create(username, password) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
        if (err) {
          console.log('Error hashing password', err);
          return reject(err);
        }
        pool.connect(function(err, client, done) {
          if(err) {
            done();
            return reject(err);
          }
          client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hash], function(err, result) {
            done();
            if(err) {
              return reject(err);
            }
            resolve(result.rows[0]);
          });
        });
      });
  });
}
//compare password
function comparePassword(user, passwordToCompare) {
  return new Promise(function(resolve) {
      bcrypt.compare(passwordToCompare, user.password, function(err, match) {
        if (err) {
          console.log('Error comparing password', err);
          return resolve(false);
        }
        resolve(match);
      });
    });
}

module.exports = {
  findByUsername: findByUsername,
  findById: findById,
  create: create,
  comparePassword: comparePassword
};

///////// mongoose

// // before a user tries to save their info, run this function, the password gets hashed
// userSchema.pre('save', function(done) {
//   // user can't be reassigned
//   const user = this;
//   bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
//     if (err) {
//       console.log('Error hashing password', err);
//       return done(new Error('Error hashing password'));// make sure to add this!
//     }
//     user.password = hash;
//     done();
//   });
// });
//
// userSchema.methods.comparePassword = function(password) {
//   const user = this;
//   return new Promise(function(resolve) {
//     bcrypt.compare(password, user.password, function(err, match) {
//       if (err) {
//         console.log('Error comparing password', err);
//         return resolve(false);
//       }
//       resolve(match);
//     });
//   });
// };
//
// const User = mongoose.model('User', userSchema);
//
// module.exports = User;
