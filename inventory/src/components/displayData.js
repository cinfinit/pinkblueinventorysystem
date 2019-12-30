import React, { Component } from "react";
import Axios from "axios";
import DataTable from "./dataTable";
import { Redirect } from "react-router-dom";
import { verify } from "jsonwebtoken";
import { Spin } from "antd";
export class displayData extends Component {
  state = {
    data: [],
    showData: false,
    redirect: true
  };
  componentDidMount = () => {
    let token = localStorage.getItem("mytoken");
    if (this.props.location.state || token) {
      this.setState({ redirect: false });
      verify(token, "secretkey", (err, authData) => {
        if (err) {
          console.log("jajskajksj");
        }
        this.setState({ redirect: false });

        Axios.get("https://inventory-firebase.herokuapp.com/fetchdata").then(
          res => {
            let firebaseData = res.data.data;
            console.log(firebaseData);
            this.setState({ data: firebaseData });
            this.setState({ showData: true });
          }
        );
      });
    }
  };

  redirection = () => {
    if (this.state.redirect) {
      return <Redirect to="/login"></Redirect>;
    }
  };

  loadTable = () => {
    if (this.state.showData) {
      return (
        <DataTable
          dataSource={this.state.data}
          editAllowed={this.props.location.state.editAllowed}
          uid={this.props.location.state.uid}
          permission={this.props.location.state.permission}
          num={this.props.location.state.num}
        />
      );
    } else {
      return <h1 style={{ textAlign: "center" }}>Loading Data </h1>;
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
        this.setState({ redirect: false });
      }
    }
    console.log(this.props.location.state.editAllowed);
    return (
      <Spin spinning={!this.state.showData}>
        <div
          style={{
            // backgroundColor: "white",
            margin: "100px auto",
            padding: "10px"
          }}
        >
          )} */}
          {this.loadTable()}
        </div>
      </Spin>
    );
  }
}

export default displayData;
