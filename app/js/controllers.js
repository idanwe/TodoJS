'use strict';

/* Controllers */

angular.module('todoApp.controllers', []).
  controller('SignUpCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.addUser = function(data) {
      var userData = {
        name: $scope.name,
        email: $scope.email,
        password: $scope.password
      };

      $http.post('/signup', userData)
        .success(function(data, status) {
          console.log("success: " + status + "data" + data);
        })
        .error(function(data, status) {
          console.log("error: " + status + "data" + data);
        });
    }
  }]);