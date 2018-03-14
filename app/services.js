(function(angular) {
    "use strict";
    var appServices = angular.module('myApp.services', ['myApp.utils']);
 
    /**
     * A service that authenticates against Fireabase using simple login
     */
    appServices.factory('authManager', ['$rootScope', 'fbRef', 'angularFireAuth', 'authScopeUtil', function($rootScope, fbRef, angularFireAuth, authScopeUtil) {
       authScopeUtil($rootScope);
 
       angularFireAuth.initialize(fbRef(), {
          scope: $rootScope,
          name: 'user',
          path: '/login'
       });
 
       // provide some convenience methods to log in and out
       return {
          login: function(providerId) {
             angularFireAuth.login(providerId, { rememberMe: true, scope: 'email'});
          },
 
          logout: function() {
             angularFireAuth.logout();
          }
       };
    }]);
 
    /**
     * A simple utility to monitor changes to authentication and set some scope values
     * for use in bindings and directives
     */
    appServices.factory('authScopeUtil', ['$log', 'updateScope', 'localStorage', '$location', function($log, updateScope, localStorage, $location) {
       return function($scope) {
          $scope.auth = {
             authenticated: false,
             user: null,
             name: null,
             provider: localStorage.get('authProvider')
          };
 
          $scope.$on('angularFireAuth:login', _loggedIn);
          $scope.$on('angularFireAuth:error', function(err) {
             $log.error(err);
             _loggedOut();
          });
          $scope.$on('angularFireAuth:logout', _loggedOut);
 
          function parseName(user) {
             switch(user.provider) {
                case 'persona':
                   return (user.id||'').replace(',', '.');
                default:
                   return user.id;
             }
          }
 
          function _loggedIn(evt, user) {
             localStorage.set('authProvider', user.provider);
             $scope.auth = {
                authenticated: true,
                user: user.id,
                name: parseName(user),
                provider: user.provider
             };
             updateScope($scope, 'auth', $scope.auth, function() {
                if( !($location.path()||'').match('/hearth') ) {
                   $location.path('/hearth');
                }
             });
          }
 
          function _loggedOut() {
             $scope.auth = {
                authenticated: false,
                user: null,
                name: null,
                provider: $scope.auth && $scope.auth.provider
             };
             updateScope($scope, 'auth', $scope.auth, function() {
              
                $location.path('/');
             });
          }
       }
    }]);
 
    
 
 })(angular);