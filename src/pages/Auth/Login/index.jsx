import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
const { Title } = Typography;

const initialstate = { email: "", password: "" };

const Login = () => {
  const { handleLogin } = useAuthContext();
  const [state, setState] = useState(initialstate);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      let { email, password } = state;
      if (!email || !password) {
        return message.error("All fields are required");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        state,
      );

      const { token, user } = res.data;

      handleLogin(user, token);
      navigate("/public");
      message.success("User login successfully");
    } catch (error) {
      message.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    color: "white",
    fontWeight: "500",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700 px-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-gray-700 shadow-lg">
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={handleFailed}
        >
          <Row>
            <Col span={24}>
              <Title level={2} className="text-center text-white">
                Login
              </Title>
            </Col>
          </Row>

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
              onChange={handleChange}
              placeholder="Enter your email"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item
            label={<span style={labelStyle}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              name="password"
              value={state.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <div className="flex justify-between mb-4 text-white text-sm">
            <Link to="/auth/reset-password">Forgot Password?</Link>
            <Link to="/auth/register">Don't have an account? Register</Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 border-none"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
