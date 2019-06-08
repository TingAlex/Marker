import _ from "lodash";
import React from "react";
import * as actions from "../../actions/user";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import { Form, Icon, Input, Button, Checkbox } from "antd";
import "../../styles/login.css";

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.props.submitLogin(values, this.props.history);
      }
    });
  };

  goSignup = () => {
    this.props.jumpToSignup(this.props.history);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "Please input your email!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          Or&nbsp;&nbsp;
          <Link to="/signup" onClick={this.goSignup}>
            register now!
          </Link>
        </Form.Item>
      </Form>
    );
  }

  sendLoginInfo = e => {
    e.preventDefault();
    const value = {
      password: e.target.elements.password.value,
      email: e.target.elements.email.value
    };
    console.log(value);
    this.props.submitLogin(value, this.props.history);
  };
}

const WrappedLoginForm = Form.create({ name: "normal_login" })(LoginForm);

export default withRouter(
  connect(
    null,
    actions
  )(WrappedLoginForm)
);
