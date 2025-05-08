// Login.tsx
import React, { useEffect } from "react";
import logo from "../../../assets/shoppoologo.png";
import Topbar from "../../../components/topbar";
import { SignInInterface } from "../../../interfaces/SignIn";
import { SignIn } from "../../../services/https/index";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Set a specific class for the body
  useEffect(() => {
    document.body.classList.add("login-body");

    // Clean up when the component is unmounted
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  const onFinish = async (values: SignInInterface) => {
    let res = await SignIn(values);

    if (res.status === 200) {
      messageApi.success("Sign-in successful");

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("seller", res.data.seller.toString());

      if (res.data.role === "Admin") {
        setTimeout(() => {
          navigate("/return");
          window.location.reload();
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("/home");
        }, 200);
      }
    } else {
      messageApi.error(res.data.error || "An error occurred during sign-in");
    }
  };

  return (
    <div>
      {contextHolder}
      <Topbar />
      <div className="login-container">
        <div className="login-left">
          <div className="logo">
            <img src={logo} alt="Shoppoo Logo" />
          </div>
        </div>
        <div className="login-right">
          <h2>Sign in</h2>
          <Form
            name="login-form"
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="Username"
              label="Username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input placeholder="Username" className="login-input" />
            </Form.Item>
            <Form.Item
              name="Password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Password" className="login-input" />
            </Form.Item>
            <a href="/Forget-password" className="forgot-password">
              Forgot password?
            </a>
            <Form.Item>
              <Button className="login-button" htmlType="submit">
                Sign in
              </Button>
            </Form.Item>
          </Form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
