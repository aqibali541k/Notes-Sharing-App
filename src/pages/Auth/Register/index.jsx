import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

const { Title } = Typography;

const initialState = {
  firstName: "",
  lastName: "",
  dob: "",
  age: "",
  email: "",
  password: "",
  confirmPassword: "",
  image: null, // ✅ FIX
};

const Register = () => {
  const { handleRegister } = useAuthContext();
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setState((prev) => ({ ...prev, image: files[0] }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "dob" ? { age: calculateAge(value) } : {}),
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const {
        firstName,
        lastName,
        dob,
        email,
        password,
        confirmPassword,
        age,
        image,
      } = state;

      if (!firstName || !lastName || !dob || !email || !password) {
        return message.error("All fields are required");
      }

      if (password !== confirmPassword) {
        return message.error("Passwords do not match");
      }

      setIsProcessing(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("dob", dob);
      formData.append("age", age);
      formData.append("email", email);
      formData.append("password", password);

      if (image) {
        formData.append("image", image); // ✅ FIX
      }

      const res = await axios.post(
        "http://localhost:8000/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      const { user, token } = res.data;

      handleRegister(user, token); // ✅ AUTO LOGIN
      message.success("Registered successfully");
      navigate("/dashboard");

      setState(initialState);
    } catch (error) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const labelStyle = { color: "white", fontWeight: 500 };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">
      <div className="max-w-3xl w-full p-6 rounded-2xl bg-gray-700 shadow-lg">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Title level={2} className="!text-center !text-white">
            Register
          </Title>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>First Name</span>}>
                <Input
                  name="firstName"
                  value={state.firstName}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Last Name</span>}>
                <Input
                  name="lastName"
                  value={state.lastName}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={<span style={labelStyle}>Date of Birth</span>}>
            <input
              type="date"
              name="dob"
              value={state.dob}
              onChange={handleChange}
              className="w-full rounded-lg p-2"
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Email</span>}>
            <Input name="email" value={state.email} onChange={handleChange} />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Password</span>}>
            <Input.Password
              name="password"
              value={state.password}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label={<span style={labelStyle}>Confirm Password</span>}>
            <Input.Password
              name="confirmPassword"
              value={state.confirmPassword}
              onChange={handleChange}
            />
          </Form.Item>

          {/* ✅ IMAGE INPUT */}
          <Form.Item label={<span style={labelStyle}>Profile Image</span>}>
            <input type="file" name="image" onChange={handleChange} />
          </Form.Item>

          <Button
            htmlType="submit"
            loading={isProcessing}
            className="!w-full !bg-blue-600 !text-white"
          >
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
