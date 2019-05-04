import _ from "lodash";
import React from "react";
import { reduxForm, Field } from "redux-form";
import contentForLogin from "./contentForLogin";
import LoginFields from "./LoginFields";
import * as actions from "../../actions/user";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class LoginForm extends React.Component {
  renderFields() {
    return _.map(contentForLogin, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={LoginFields}
          type="text"
          label={label}
          name={name}
        />
      );
    });
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

  render() {
    return (
      <div>
        <form onSubmit={this.sendLoginInfo}>
          {this.renderFields()}
          {this.props.error && <strong>{this.props.error}</strong>}
          <button type="submit" className="teal btn-flat right white-text">
            Login
          </button>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  _.each(contentForLogin, ({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });
  return errors;
};

const After = connect(
  null,
  actions
)(LoginForm);

export default reduxForm({
  validate,
  form: "loginForm"
})(withRouter(After));
