'use strict';

// signup controller
app.controller('RegisterFormController', ['$firebaseAuth', '$firebaseArray', '$scope', '$http', '$state', function($firebaseAuth, $firebaseArray, $scope, $http, $state) {
    $scope.register = function() {
      //var name = $scope.user.fullname;
      var email = $scope.user.email;
      var password = $scope.user.password;

       var ref = firebase.database().ref("users");

      ref.orderByChild("email").equalTo(email).once("value")
      .then (function(snapshot) {

        //Check if email is already exist in real time database
        var exist = snapshot.exists();
        if (!exist){
          $firebaseArray(ref).$add({
            username: $scope.user.name,
            email: $scope.user.email
          })
          .then(function(ref){
            console.log('Added to database');
            
            $scope.user.fullname = "";
            $scope.user.email = "";
            $scope.user.password = ""; 
          });
        }

        //Create user authentication in firebase and check if the user is already exist
        if(email && password){
          var auth = $firebaseAuth();
          auth.$createUserWithEmailAndPassword(email, password)
          .then(function(){
            $state.go('access.login');
            console.log("User Authenticated");
          }).catch(function(error){
              $scope.authError = error.message;
           
          });
        }
      });
      
    }

    $scope.register2 = function() {

      var ref = firebase.database().ref("users");

          console.log("Signing in");
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...

        ref.orderByChild("email").equalTo(user.email).once("value")
      .then (function(snapshot) {

        //Check if email is already exist in real time database
        var exist = snapshot.exists();
        if (!exist){
           $state.go('app.ui.googlemapfull');

        var userId = user.uid;
          //Create a user profile in the DB
          ref.once("value")
            .then(function (snapshot){
              //check if exist
              var r = snapshot.child(userId).exists();
              if(r !== true){
                ref.child(userId).set({
                  username: user.displayName,
                  photoURL: user.photoURL,
                  email: user.email
                })
                
              }
              return;
            });
        } else {
          $scope.authError = 'The email address is already in use by another account.';
          console.log('The email address is already in use by another account.');
        }
      });
      }) 
    };

    function app(user){
      $state.go('app.ui.googlemapfull');
      console.log("Logged in");
    }
  }])
 ;