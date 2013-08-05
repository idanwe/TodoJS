'use strict';


// Declare app level module which depends on filters, and services
angular.module('todoApp', ['todoApp.filters', 'todoApp.services', 'todoApp.directives', 'todoApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', { templateUrl: 'partials/signup.html', controller: 'SignUpCtrl' });
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
