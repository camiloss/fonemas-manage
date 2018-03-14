
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://glowing-fire-6722.firebaseio.com"
});
// On sign up.
/*exports.processSignUp = functions.auth.user().onCreate(event => {
    const user = event.data; // The Firebase user.
    // Check if user meets role criteria.
    if (user.displayName) {
      const customClaims = {
        admin: true
      };
      // Set custom user claims on this newly created user.
      return admin.auth().setCustomUserClaims(user.uid, customClaims)
        .then(() => {
       
        })
        .catch(error => {
          console.log(error);
        });
    }
  });*/
  admin.auth().setCustomUserClaims('MShy17Evg9UDi09c0LQWj6ntKim2', {
    admin: true
  }).then((setCustom) => {
      console.log(setCustom)
  });
  admin.auth().getUser('MShy17Evg9UDi09c0LQWj6ntKim2').then((user) => {
    // Confirm user is verified.
    console.log(user)
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
     
    
  }).catch((error) => {
    console.log(error);
  });
