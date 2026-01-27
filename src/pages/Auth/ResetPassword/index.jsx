import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";

const { Title } = Typography;

const initialstate = { email: "" };

const ResetPassword = () => {
  const [state, setState] = useState(initialstate);

  // handle input
  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // when form fails validation
  const handleFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  // when form is submitted successfully
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/reset-password-request`,
        {
          email: state.email,
        },
      );

      message.success(res.data.message); // show success
      console.log("Reset Link:", res.data.resetLink); // just for dev
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const labelStyle = {
    color: "white",
    fontWeight: "500",
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-blue-700">
        <div className="max-w-sm sm:max-w-2xl md:max-w-2xl lg:max-w-xl w-full p-6 rounded-2xl bg-gray-700 shadow-lg">
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            onFinishFailed={handleFailed}
          >
            <Row>
              <Col span={24}>
                <Title level={2} className="!text-center !text-white">
                  Reset Password
                </Title>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={<span style={labelStyle}>Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    name="email"
                    value={state.email}
                    placeholder="Enter your email"
                    className="!rounded-lg !py-2"
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Button
                  htmlType="submit"
                  className="!bg-blue-600 hover:!bg-blue-700 !text-white !text-center !rounded-lg !border-none !w-full !py-2"
                >
                  Request Reset Link
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
