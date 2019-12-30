import React, { Component } from "react";
import "./login.css";
import { Button } from "antd";

export class home extends Component {
  render() {
    return (
      <div style={{ margin: "100px auto" }}>
        <h1
          className="heading"
          style={{ textAlign: "center", fontSize: "40px" }}
        >
          Welcome to Inventory System
        </h1>
        <div
          className="back"
          style={{
            margin: "100px auto",
            width: "500px",
            border: "1px solid black",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 2px 40px 1px #969696"
          }}
        >
          <p style={{ fontSize: "20px" }}>
            This is a basic Inventory System which helps to maintain a regular
            inventory <br />
            It consist of Basically Authenication accompanied with logic of
            working of basic Inventory
          </p>
          <Button className="login-form-button">
            {" "}
            <a href="/signup">Check It out</a>
          </Button>
        </div>
      </div>
    );
  }
}

export default home;
