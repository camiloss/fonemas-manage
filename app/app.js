'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngMaterial',
    'myApp.config',
    'myApp.security',
    'myApp.home',
    'myApp.account',
    'myApp.chat',
    'myApp.login','myApp.cliente'
  ])

.config(function($mdIconProvider) {
  $mdIconProvider
    .iconSet('social', 'bower_components/angular-material/demos/icon/demoSvgIconSets/assets/social-icons.svg', 48)
   
    .defaultIconSet('bower_components/angular-material/demos/icon/demoSvgIconSets/assets/core-icons.svg', 48);
})

  .run(['$rootScope', 'Auth', function($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function(user) {
      $rootScope.loggedIn = !!user;
    });
  }]);
