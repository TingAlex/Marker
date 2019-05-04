import _ from "lodash";
import React from "react";
import * as actions from "../../actions/user";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
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