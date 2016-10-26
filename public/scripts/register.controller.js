angular.module('passportApp')
.controller('RegisterController', RegisterController);

function RegisterController($http, $location) {
  console.log('RegisterController loaded');
  var ctrl = this;

  // sends username and password to /register path
  ctrl.register = function() {
    console.log('registering new user');
    $http.post('/register', {
      username: ctrl.username,
      password: ctrl.password
    }).then(function(){
      $location.path('/home');
    }, function(error) {
      console.log('error registering', error);
    });
  };
}
