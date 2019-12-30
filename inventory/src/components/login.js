import { Form, Icon, Input, Button, Checkbox } from "antd";
import React from "react";
import "./login.css";
import axios from "axios";
import { verify } from "jsonwebtoken";
import Firebase from "../Config/Firebase";
import WrapperStatistic from "antd/lib/statistic/Statistic";
import { Redirect } from "react-router-dom";
let tokken;
let redirection = false;
class NormalLoginForm extends React.Component {
  state = {
    email: "",
    password: "",
    users: [],
    redirect: false,
    token: ""
  };
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount = () => {
    let users = [];
    Firebase.firestore()
      .collection("users")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(i => {
          var user = {
            email: i.data().email,
            password: i.data().password,
            role: i.data().role,
            username: i.data().username
          };
          users.push(user);
        });
      });
    this.setState({ users });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let i = 0; i < this.state.users.length; i++) {
          if (
            this.state.users[i].email === this.state.email &&
            this.state.users[i].password === this.state.password
          ) {
            redirection = true;
            //  axios.post('/api/login',{

            axios
              .post("https://fetcher-api123.herokuapp.com/api/login", {
                email: this.state.email,
                password: this.state.password,
                role: this.state.users[i].role,
                username: this.state.users[i].username
              })
              .then(res => {
                localStorage.setItem("mytoken", res.data.token);
                this.setState({ token: res.data.token });
                this.setState({ redirect: true });
                // <Redirect to="/">
                // localStorage.setItem("mytoken", res.data.token);
                // this.setState({ token: res.data.token });
              })
              .catch(err => {});

            break;
          } else {
            redirection = false;
          }
        }
        if (redirection) {
          console.log("done");
        } else {
          alert("Credentials Incorrect");
        }
        // console.log("Received values of form: ", values);
      }
    });
  };

  redirectionPage = () => {
    // setTimeout(() => {
    if (this.state.redirect) {
      let tokenRedirect = false;
      // localStorage.setItem('mytoken',this.state.token)
      console.log("redirected ");
      let token = localStorage.getItem("mytoken");
      verify(token, "secretkey", (err, authData) => {
        if (err) {
          console.log("err", err);
          //   this.setState({ redirect: true });
          alert("some error occured ");
          //   return;
        }
        console.log("token", token);
        console.log("ab toh redirect krle ");
        tokenRedirect = true;
      });
      if (tokenRedirect) {
        return (
          <Redirect
            to={{ pathname: "/dashboard", state: { token: this.state.token } }}
          />
        );
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className="back"
        style={{
          margin: "100px auto",
          width: "400px",
          border: "1px solid black",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 2px 40px 1px #969696"
        }}
      >
        {this.redirectionPage()}
        <h1 style={{ fontSize: "40px", color: "black" }}>Login</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!"
                }
              ]
            })(
              <Input
                onChange={this.inputHandler}
                value={this.state.email}
                name="email"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Enter your Email"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                onChange={this.inputHandler}
                value={this.state.password}
                name="password"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Enter your Password"
              />
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              //   type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <br />
            <Button className="login-form-button">
              {" "}
              <a href="/signup">SignUp</a>
            </Button>
            {/* Or <a href="">register now!</a> */}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
  NormalLoginForm
);

export default WrappedNormalLoginForm;
