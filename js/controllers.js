angular.module('starter.controllers', ['firebase'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $firebase, $firebaseAuth) {
$scope.filterName = {};


  var ref = new Firebase("https://amber-inferno-4677.firebaseio.com/todos");
  var sync = $firebase(ref);

  // FB Login
  $scope.LoginUser = {};
  var fbref = new Firebase("https://todosagile.firebaseio.com/");
  $scope.authObj = $firebaseAuth(fbref);
  $scope.fb_login = function() {
    $scope.authObj.$authWithOAuthPopup("facebook")
      .then(function(authData) {
        $scope.isLogin = true;
        console.log(JSON.stringify(authData));
        $scope.LoginUser.name = authData.facebook.displayName;
        $scope.LoginUser.gender = authData.facebook.cachedUserProfile.gender;
        $scope.LoginUser.imgSrc = authData.facebook.cachedUserProfile.picture.data.url;
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
  };

  $scope.todos = sync.$asArray();

  $scope.totalTasks = function() {
    return $scope.todos.length;
  };

  $scope.toggleDone = function(item) {
    item.done = !item.done;
    $scope.todos.$save(item);
  };

  $scope.totalCompleted = function() {
    return _.filter($scope.todos, function(item) {
      return item.done;
    }).length;
  };

  $scope.remaining = function() {
    return _.filter($scope.todos, function(item) {
      return !item.done;
    }).length;
  };

  $scope.addTodo = function(item) {
    var todo = {
      text: item,
      done: false
    };
    if ($scope.isLogin) {
      todo.author = $scope.LoginUser.name;
    } else {
      todo.author = '';
    }
    $scope.todos.$add(todo);
    $scope.newItem = "";
  };


  $scope.removeItem = function(item) {
    $scope.todos.$remove(item);
  };

  $scope.clearCompleted = function() {
    _.each(_.filter($scope.todos, function(item) {
      return item.done;
    }), $scope.removeItem);
  };

  $scope.updateCheckName = function(status) {
    console.log($scope.filterName);
    if (status && $scope.isLogin) {
      $scope.filterName.author = $scope.LoginUser.name;
    } else {
      $scope.filterName.author = '';
    }
  };

  $scope.getImgSrc = function(author) {
    if (author === $scope.LoginUser.name)
      return $scope.LoginUser.imgSrc;
    else
      return '';
  };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
