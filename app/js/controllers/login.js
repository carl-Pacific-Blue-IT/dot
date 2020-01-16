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

        var user = firebase.auth().currentUser;

        if(user.emailVerified){
           $state.go('app.ui.googlemapfull');
          console.log('User Login Succesful');
        } else {
          $scope.authError = true;
          $scope.authError = 'You need to verify first your email.';
        }

       
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

          var user = firebase.auth().currentUser;

          if(user.emailVerified){
            app(user);
          console.log("Signed in");
            //$state.go('app.ui.googlemapfull');
           //console.log('User Login Succesful');
         } else {
           $scope.authError = true;
           $scope.authError = 'You need to verify first your email.';
         }
 
          
        }
      });
      }) .catch(function(error){
        $scope.authError = true;
        $scope.authError = error.message;
      });
    };

    function app(user){
      $state.go('app.ui.googlemapfull');
    }



    $scope.reset = function() {
      
      var resetEmail = $scope.user.resetEmail;
      var auth = $firebaseAuth();
      var auth2 = firebase.auth();

      if(resetEmail != ""){
        auth2.sendPasswordResetEmail(resetEmail).then(function(){
             $scope.user.resetEmail = "";
            $scope.authError = 'A reset link sent to your email address. It will expire after 2 hours.';
        })
        .catch(function(error){
            $scope.authError = true;
             $scope.authError = error.message;
        });
      }
    };
  }])
;