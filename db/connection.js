//const mongoose = require('mongoose');
const pg = require('pg');

var config = {
  database : 'rho'
};

var pool = new pg.Pool(config);

module.exports = pool;

//////////// mongoose
// exports.connect = function () {
//   mongoose.connect('mongodb://localhost/rho');
//
//   var db = mongoose.connection;
//   db.on('error', function(error){
//     console.log('error connecting', error);
//   });
//
//   db.once('open', function(){
//     console.log('connected to mongo');
//   });
// };
