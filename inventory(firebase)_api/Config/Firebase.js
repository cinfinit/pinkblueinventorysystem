const firebase = require("firebase");
var firebaseConfig = {
  apiKey: //add details here,
  authDomain: //add details here,
  databaseURL: //add details here,
  projectId: //add details here,
  storageBucket: //add details here,
  messagingSenderId: //add details here,
  appId: //add details here 
};
// Initialize Firebase
var Firebase = firebase.initializeApp(firebaseConfig);
// export default Firebase;
// module.exports={
//     Firebase:Firebase
// }
export { Firebase };
