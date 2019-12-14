'use strict';

/* Controllers */
  // signin controller
app.controller('LoginFormController', ['$firebaseAuth', '$firebaseArray', '$scope', '$http', '$state', function($firebaseAuth, $firebaseArray, $scope,  $http, $state, ) {
    
    $scope.login = function() {
      
      var username = $scope.user.email;
      var password = $scope.user.password;
      var auth = $firebaseAuth();
      // Try to login
      auth.$signInWithEmailAndPassword(username, password)
      .then(function() {
        $state.go('app.ui.googlemapfull');
        $scope.authError = false;
        console.log('User Login Succesful');
      }) .catch(function(error){
        $scope.authError = true;
        $scope.authError = error.message;
      });
    };

    $scope.login2 = function() {

      var ref = firebase.database().ref("users");
          console.log("Signing in");
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...

        var userDelete = firebase.auth().currentUser;

        ref.orderByChild("email").equalTo(user.email).once("value")
      .then (function(snapshot) {

        //Check if email is already exist in real time database
        var exist = snapshot.exists();
        if (!exist){
          console.log("Don't Exists!");
          console.log("There is no user record corresponding to this identifier. The user may have been deleted.");
          $scope.authError = 'There is no user record corresponding to this identifier. The user may have been deleted.';
          user.delete().then(function() {
            // User deleted.
            console.log('Successfully deleted user');
          }).catch(function(error) {
            // An error happened.
            console.log('Error deleting user:', error);
          });
        } else {
          app(user);
          console.log("Signed in");
        }
      });
      })
    };

    function app(user){
      $state.go('app.ui.googlemapfull');
    }
  }])
;
