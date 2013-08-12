'use strict';

/* Controllers */

angular.module('todoApp.controllers', []).
  controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.signup = function() {
      var userData = {
        username: $scope.username,
        email: $scope.email,
        password: $scope.password
      };

      $http.post('/signup', userData)
        .success(function(data, status) {
          console.log('success: ', status);
          console.log('data: ', data);
          $location.path('/tasks');
        })
        .error(function(data, status) {
          console.log('error: ', status);
          console.log('data: ', data);
        });
    }
  }])
  .controller('SigninCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.signin = function() {
      var query = {
            username: $scope.username,
            password: $scope.password
          };

      $http.get('/signin', { params: query })
        .success(function(data, status) {
          $location.path('/tasks');
        })
        .error(function(data, status) {
          console.log('sign in error');
        });
    };
  }])
  .controller('TasksCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.logout = function() {
      $http.get('/logout')
        .success(function(data, status) {
          $location.path('/signin');
        })
        .error(function(data, status) {
        });
    };

    $http.get('/tasks')
      .success(function(data, status) {
        $scope.tasks = data;
      })
      .error(function(data, status) {
        if (status === 403) {
          $location.path('/signin');
        }
      });

    $scope.addTask = function() {
      var text = $scope.newTaskText;
      if (!text) return;

      var task = { text: text, done: false };
      $scope.newTaskText = '';

      $http.post('/tasks', task)
        .success(function(data, status) {
          $scope.tasks.push(data);
          console.log('add task success')
        })
        .error(function(data, status) {
          console.log('add task error')
        });
    };

    $scope.updateTaskStatus = function(task) {
      $http({ method: 'PATCH', url: '/tasks/' + task.task_id, params: { done: task.done }})
        .success(function(data, status) {})
        .error(function(data, status) {});
    };

    $scope.deleteTask = function(task) {
      $http.delete('/tasks/' + task.task_id)
        .success(function(data, status) {
          var index = $scope.tasks.indexOf(task)
          $scope.tasks.splice(index,1);
        })
        .error(function(data, status) { debugger} );
    };

  }]);