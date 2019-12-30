var express = require("express");
var jwt = require("jsonwebtoken");
var app = express();
var bp = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/api", (req, res) => {
  res.json({
    message: "welcome to the api"
  });
});

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.json({
        error: true
      });
      // res.sendStatus(404);
    } else {
      res.json({
        message: true,
        authData
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    username: req.body.username
  };

  jwt.sign({ user }, "secretkey", { expiresIn: "1hr" }, (err, token) => {
    res.json({
      token
    });
  });
});

function verifyToken(req, res, next) {
  // get auth header
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(404);
  }
}

app.listen(process.env.PORT || 5000, () => {
  console.log("server started on 5000");
});
