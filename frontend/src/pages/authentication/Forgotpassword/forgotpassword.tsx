import React from "react";
import logo from "../../../assets/shoppoologo.png";
import Topbar from "../../../components/topbar";
import { UsersInterface } from "../../../interfaces/IUser";
import { ResetPassword } from "../../../services/https/index";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

// Import the CSS file
import "./forgotpassword.css";

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UsersInterface) => {
    try {
      const res = await ResetPassword(values);

      if (res.status === 201 || res.status === 200) {
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
          content: res.data.error || "An unexpected error occurred.",
        });
      }
    } catch (error: any) {
      console.error("ResetPassword Error:", error);
      messageApi.open({
        type: "error",
        content:
          error?.response?.data?.message ||
          "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Topbar />
      <div className="forgot-container">
        <div className="forgot-left">
          <div className="logo">
            <img src={logo} alt="Shoppoo Logo" />
          </div>
        </div>
        <div className="forgot-right">
          <h2>Reset Password</h2>
          <Form
            name="reset-password-form"
            onFinish={onFinish}
            layout="vertical"
            className="forgot-form"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="Password" className="wide-input3" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm Password"
                className="wide-input3"
              />
            </Form.Item>
            <Form.Item>
              <Button className="forgotbutton" htmlType="submit" block>
                CONFIRM
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
