import React, { Component } from "react";
import { Button } from "antd";
// import "./notfound.css";
export class notfound extends Component {
  render() {
    return (
      <div style={{ textAlign: "center", margin: "150px auto" }}>
        <h1 style={{ fontSize: "150px", lineHeight: "1" }}>Oops</h1>
        <h1>The page you are looking for isn't here </h1>
        <Button className="login-form-button">
          {" "}
          <a href="/">Go to Home</a>
        </Button>
      </div>
    );
  }
}

export default notfound;
