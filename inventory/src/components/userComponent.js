import React, { Component } from "react";
import "./userComponent.css";
import Addimg from "../addinventory.png";
import Fetchimg from "../fetchinventory.png";
import Accessimg from "../access.jfif";
import { Row, Col, Button } from "antd";
import Nav from "./wrapper";
import { Link } from "react-router-dom";
import { verify } from "jsonwebtoken";
import { Redirect } from "react-router-dom";
import "./login.css";
export class userComponent extends Component {
  state = {
    redirect: true,
    role: "",
    username: "",
    uid: "",
    editAllowed: "",
    permission: "",
    logout: false
  };
  componentDidMount = () => {
    let token = localStorage.getItem("mytoken");
    if (this.props.location.state || token) {
      this.setState({ redirect: false });

      verify(token, "secretkey", (err, authData) => {
        if (err) {
          this.setState({ redirect: true });
        }
        this.setState({ redirect: false });

        this.setState({ role: authData.user.role });
        this.setState({ username: authData.user.username });
      });
    }
  };
  redirection = () => {
    if (this.state.redirect) {
      return <Redirect to="/login"></Redirect>;
    }
  };

  logout = () => {
    localStorage.clear();
    this.setState({ logout: true });
  };
  logoutRedirection = () => {
    if (this.state.logout) {
      return <Redirect to="/login"></Redirect>;
    }
  };
  render() {
    if (this.state.redirect) {
      var token = localStorage.getItem("mytoken");

      if (!this.props.location.state && !token) {
        console.log("ssdsd");
        // var token = localStorage.getItem('mytoken')
        console.log(this.props.location.state);
        return <Redirect to={{ pathname: "/login" }} />;
      } else {
        verify(token, "secretkey", (err, authData) => {
          if (err) {
            return <Redirect to={{ pathname: "/login" }} />;
          }
          this.setState({ redirect: false });
        });

        // this.setState({ redirect: false });
      }
    }
    return (
      <div>
        {/* {this.redirection()} */}
        {this.logoutRedirection()}
        <Nav name={this.state.username} logout={this.logout} />

        <div className="heading">
          <Row className="heading">
            <Col span={8}>
              <Link
                to={{
                  pathname: "/displaydata",
                  state: {
                    uid: this.state.role,
                    editAllowed: false,
                    permission: false,
                    num: 1
                  }
                }}
              >
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    margin: "100px auto",
                    backgroundColor: "white"
                  }}
                >
                  <img
                    src={Fetchimg}
                    style={{ width: "200px", height: "200px", padding: "5px" }}
                  />
                  <h1>Fetch Inventory Details</h1>
                </div>
              </Link>
            </Col>
            <Col span={8}>
              <Link
                to={{
                  pathname: "/displaydata",
                  state: {
                    uid: this.state.role,
                    editAllowed: true,
                    permission: false,
                    num: 2
                  }
                }}
              >
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    margin: "100px auto",
                    backgroundColor: "white"
                  }}
                >
                  <img
                    src={Addimg}
                    style={{ width: "200px", height: "200px", padding: "5px" }}
                  />
                  <h1>Add New Item</h1>
                </div>
              </Link>
            </Col>
            {this.state.role === "manager" && (
              <Col span={8}>
                <Link
                  to={{
                    pathname: "/displaydata",
                    state: {
                      uid: "manager",
                      editAllowed: false,
                      permission: true,
                      num: 3
                    }
                  }}
                >
                  <div
                    className="card"
                    style={{
                      textAlign: "center",
                      margin: "100px auto",
                      backgroundColor: "white"
                    }}
                  >
                    <img
                      src={Accessimg}
                      style={{
                        width: "200px",
                        height: "200px",
                        padding: "5px"
                      }}
                    />
                    <h1>Grant/Revoke Permissions</h1>
                  </div>
                </Link>
              </Col>
            )}
          </Row>
          <div className="heading" style={{ textAlign: "center" }}>
            <Button className="login-form-button" onClick={this.logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default userComponent;
