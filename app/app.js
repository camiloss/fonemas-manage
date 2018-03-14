'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngMaterial',
    'firebase',

    /*'myApp.security',*/
    
    'myApp.login',
    'myApp.cliente'
  ])

 
.config(function() {
  var config = {
    apiKey: "AIzaSyD8W2l87jwVKI992wk1I8KSVdXqaP7wkqM",
    authDomain: "glowing-fire-6722.firebaseapp.com",
    databaseURL: "https://glowing-fire-6722.firebaseio.com",
    projectId: "glowing-fire-6722",
    storageBucket: "glowing-fire-6722.appspot.com",
    messagingSenderId: "959383920648"
  };
  firebase.initializeApp(config);
})

.config(function($mdIconProvider) {
  $mdIconProvider
    .iconSet('social', 'https://material.angularjs.org/latest/img/icons/sets/social-icons.svg', 48)

    .defaultIconSet('https://material.angularjs.org/latest/img/icons/sets/core-icons.svg', 48);
})

   /** AUTHENTICATION
   ***************/
  /*.factory('Auth', ['$firebaseAuth', 'fbutil', function($firebaseAuth, fbutil) {
    return $firebaseAuth(fbutil.ref());
  }])*/

  /*.run(['$rootScope', 'authManager', function($rootScope, authManager) {
    $rootScope.login = authManager.login;
    $rootScope.logout = authManager.logout;
  }])*/


  .run(['$rootScope', '$firebaseAuth', function($rootScope,$firebaseAuth) {
    // track status of authentication
    $firebaseAuth().$onAuthStateChanged(function(user) {
      $rootScope.loggedIn = !!user;
      $rootScope.user = user;
    });
  }]);
