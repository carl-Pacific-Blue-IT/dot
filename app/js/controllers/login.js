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

      function newLoginHappened(user){
        if(user){
          console.log("Signed in");
          app(user);
        } else {
          console.log("Signing in");
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...

        var userId = user.uid;
          //Create a user profile in the DB
          ref.once("value")
            .then(function (snapshot){
              //check if exist
              var r = snapshot.child(userId).exists();
              if(r !== true){
                ref.child(userId).set({
                  username: user.displayName,
                  photoURL: user.photoURL
                })
                
              }
              return;
            });

      })
        }
      }

      firebase.auth().onAuthStateChanged(newLoginHappened);

      
    };

    function app(user){
      $state.go('app.ui.googlemapfull');
      console.log("Logged in");
    }
  }])
;
