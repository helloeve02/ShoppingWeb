import React from "react";
import logo from "../../../assets/shoppoologo.png";
import Topbar from "../../../components/topbar";
import { UsersInterface } from "../../../interfaces/IUser";
import { CreateUser } from "../../../services/https/index";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./signup.css"; // นำเข้าไฟล์ CSS ที่สร้างใหม่

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UsersInterface) => {
    try {
      const res = await CreateUser(values);

      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occurred during signup. Please try again.",
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Topbar />
      <div className="SignUp-container">
        <div className="SignUp-left">
          <div className="logo">
            <img src={logo} alt="Shoppoo Logo" />
          </div>
        </div>
        <div className="SignUp-right">
          <h2>Sign Up</h2>
          <Form
            name="signup-form"
            onFinish={onFinish}
            layout="vertical"
            className="SignUp-form"
          >
            <Form.Item
              name="Username"
              label="Username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input placeholder="Username" className="SignUp-input" />
            </Form.Item>
            <Form.Item
              name="Email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Email" className="SignUp-input" />
            </Form.Item>
            <Form.Item
              name="Password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Password" className="SignUp-input" />
            </Form.Item>
            <Form.Item>
              <Button className="SignUp-button" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <p className="signin-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
