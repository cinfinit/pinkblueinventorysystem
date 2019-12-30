import React, { Component } from "react";
import { Button } from "antd";
export class wrapper extends Component {
  render() {
    return (
      <div>
        <div style={{ height: "50px", backgroundColor: "black" }}>
          <h2 style={{ color: "white", padding: "10px", textAlign: "center" }}>
            Hello {this.props.name}
          </h2>
        </div>

        {this.props.children}
      </div>
    );
  }
}

export default wrapper;
