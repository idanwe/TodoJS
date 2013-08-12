'use strict';


// Declare app level module which depends on filters, and services
angular.module('todoApp', ['todoApp.filters', 'todoApp.services', 'todoApp.directives', 'todoApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', { templateUrl: 'partials/signup.html', controller: 'SignupCtrl' })
    $routeProvider.when('/signin', { templateUrl: 'partials/signin.html', controller: 'SigninCtrl' })
    $routeProvider.when('/tasks' , { templateUrl: 'partials/tasks.html' , controller: 'TasksCtrl'  })
    $routeProvider.otherwise({ redirectTo: '/' });
  }]);
