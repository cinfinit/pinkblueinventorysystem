import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Route, link, BrowserRouter, Switch } from "react-router-dom";
import Usercomponent from "./components/userComponent";
import Displaydata from "./components/displayData";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";
import NotFound from "./components/notfound";
const routing = (
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/dashboard" component={Usercomponent} />
        <Route exact path="/displaydata" component={Displaydata} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />

        <Route component={NotFound}></Route>
      </Switch>
    </div>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
