"use strict";
angular.module('myApp.login', ['firebase.utils', 'firebase.auth', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.html'
    });
  }])

  .controller('LoginCtrl', ['$scope', 'Auth', '$rootScope', 'fbutil','FBURL', function($scope, Auth, $rootScope, fbutil,FBURL) {
  

    $scope.login = function(email, pass) {
      $scope.err = null;
      Auth.$authWithOAuthPopup("google", {})
        .then(function( user ) {
          $rootScope.user=user;
        }, function(err) {
          $scope.err = errMessage(err);
        });
    };
   $scope.googleLogin = function() {
      var ref = new Firebase(FBURL);
      ref.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
              console.log("Login Failed!", error);
          } else {
              console.log("Authenticated successfully with payload:", authData);
          }
      });
    };



   
  }]);