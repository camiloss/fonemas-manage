"use strict";
angular.module('myApp.login', ['firebase', 'ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
      controller: 'LoginCtrl',
      templateUrl: 'login/login.html'
    });
  }])

  .controller('LoginCtrl', ['$scope', '$firebaseAuth', '$rootScope', function($scope, $firebaseAuth, $rootScope) {
  

    $scope.login = function() {
      $scope.err = null;
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      firebase.auth().languageCode = 'es';
      
      firebase.auth().signInWithPopup(provider)
      //$firebaseAuth().$signInWithPopup("google")
        .then(function( response ) {
          $rootScope.user=response.user;
        })
        .catch(function(error) {
          console.log("Authentication failed:", error);
        });;
    };

    $scope.logout=function(){
      $firebaseAuth().$signOut();
    };




   
  }]);