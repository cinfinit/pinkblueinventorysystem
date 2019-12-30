import { Form, Icon, Input, Button, Checkbox } from "antd";
import React from "react";
import "./login.css";
import axios from "axios";
import Firebase from "../Config/Firebase";
import WrapperStatistic from "antd/lib/statistic/Statistic";
import { Redirect } from "react-router-dom";
var db = Firebase.firestore();
let redirection = false;
class NormalLoginForm extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    users: [],
    redirect: false,
    confirmpassword: "",
    role: "",
    check: false
  };
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ check: this.state.check || !!value });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };
  componentDidMount = () => {
    let users = [];
    Firebase.firestore()
      .collection("users")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(i => {
          users.push(i.data().email);
        });
      });
    this.setState({ users });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let emailCheck = false;
        for (let i = 0; i < this.state.users.length; i++) {
          if (this.state.email === this.state.users[i]) {
            emailCheck = true;
            break;
          }
        }
        if (!emailCheck) {
          // console.log("state",this.state)
          db.collection("users")
            .add({
              username: this.state.username,
              email: this.state.email,
              password: this.state.password,
              role: this.state.role
            })
            .then(res => {
              alert("Account Created");
            })
            .catch(err => {});
          this.setState({ redirect: true });
        } else {
          alert("email already exist");
        }

        // console.log("Received values of form: ", values);
      }
    });
  };

  redirection = () => {
    if (this.state.redirect) {
      return <Redirect to="/login"></Redirect>;
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
          borderRadius: "10px"
          //   boxShadow: "0px 2px 40px 1px #969696"
        }}
      >
        {this.redirection()}
        <h1 style={{ fontSize: "40px", color: "black" }}>Signup</h1>
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
                hasFeedback
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
            {getFieldDecorator("username", {
              rules: [
                {
                  //   type: "email",
                  required: true,
                  message: "Please input your username!"
                }
              ]
            })(
              <Input
                hasFeedback
                onChange={this.inputHandler}
                value={this.state.username}
                name="username"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Enter your username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("role", {
              rules: [
                {
                  //   type: "email",
                  required: true,
                  message: "Please input your role!"
                }
              ]
            })(
              <Input
                hasFeedback
                onChange={this.inputHandler}
                value={this.state.role}
                name="role"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Enter your Role (manager or assistant)"
              />
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(
              <Input.Password
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

          <Form.Item hasFeedback>
            {getFieldDecorator("confirmpassword", {
              rules: [
                { required: true, message: "Please Re-Enter your Password!" },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(
              <Input.Password
                onBlur={this.handleConfirmBlur}
                onChange={this.inputHandler}
                value={this.state.confirmpassword}
                name="confirmpassword"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Confirm your Password"
              />
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              //   type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Sign Up
            </Button>
            <br />
            <Button className="login-form-button">
              {" "}
              <a href="/login">Login</a>
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
