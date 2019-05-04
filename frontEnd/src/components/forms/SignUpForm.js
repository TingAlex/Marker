import _ from "lodash";
import React from "react";
import { reduxForm, Field } from "redux-form";
import contentForLogin from "./contentForSignUp";
import LoginFields from "./SignUpFields";
import * as actions from "../../actions/user";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class SignUpForm extends React.Component {
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
  sendSignupInfo = e => {
    e.preventDefault();
    const value = {
      password: e.target.elements.password.value,
      username: e.target.elements.username.value,
      email: e.target.elements.email.value,
    };
    this.props.submitSignup(value,this.props.history);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.sendSignupInfo}>
          {this.renderFields()}
          <button type="submit" className="teal btn-flat right white-text">
            Sign up
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
)(SignUpForm);

export default reduxForm({
  validate,
  form: "signupForm"
})(withRouter(After));
