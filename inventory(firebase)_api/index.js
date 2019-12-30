const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const firebase = require("./Config/Firebase");
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
const app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.get("/fetchdata", (req, res) => {
  // let data = [];
  Firebase.database()
    .ref()
    .once("value", response => {
      let firebaseData = response.val();
      if (firebaseData !== null) {
        // data = response.val().FirebaseArray;
        return res.json({ data: response.val().FirebaseArray });
      } else {
        return res.json({ data: [] });
      }
    });
});

app.post("/setdata", (req, res) => {
  let FirebaseArray = req.body.data;
  Firebase.database()
    .ref()
    .set({ FirebaseArray })
    .then(response => {
      return res.send("changes made");
    });
});



app.listen(process.env.PORT || 5000, () => {
  console.log("server is up and running ");
});
