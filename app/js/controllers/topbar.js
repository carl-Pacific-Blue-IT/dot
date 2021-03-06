app.controller('MessagesDropDownCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/messages.json').then(function(response) {
      $scope.messages = response.data;
    });
  }]);



app.controller('NotificationsDropDownCtrl', ['$firebaseAuth', '$scope', '$http', '$state',
  function ($firebaseAuth, $scope, $http, $state) {
    // $http.get('data/notifications.json').then(function(response) {
    //   $scope.notifications = response.data;
    // });
    $scope.logout = function() {
      var auth = $firebaseAuth();
      auth.$signOut().then(function() {
        // Sign-out successful.
        console.log("Logged Out Successfully");
        $state.go('access.login');
      }).catch(function(error) {
        // An error happened.
        console.log(error);
      });
    }
  }]);