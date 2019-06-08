import React from "react";
import SignUpForm from "./forms/SignUpFormFinal";
import { Row, Col } from "antd";

class SignUp extends React.Component {
  render() {
    return (
      <Row>
        <Col span={8} />
        <Col span={8}>
          <SignUpForm />
        </Col>
        <Col span={8} />
      </Row>
    );
  }
}

export default SignUp;
