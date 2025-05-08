import React from "react";
import { Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./profile.css";
import { ChangePassword } from "../../services/https";
import ProfileฺBar from "../../components/profile/profile";
import { PasswordInterface } from "../../interfaces/Password";

const Password: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // ตรวจสอบว่า id เป็น string ที่ส่งมาจาก URL
    const [messageApi] = message.useMessage();

    const onFinish = async (values: PasswordInterface) => {
        try {
            if (!id) {
                throw new Error("User ID is missing.");
            }

            // เรียกใช้งาน ChangePassword
            const res = await ChangePassword(Number(id), {
                UserID: Number(id),
                Password: values.Password, // แก้ไขให้สอดคล้องกับ API
                NewPassword: values.NewPassword, // ใช้ค่าที่ส่งมาจากฟิลด์ password
            });

            if (res.status === 201 || res.status === 200 || res.status === 204) {
                message.success("Password changed successfully!")
                message.success("Please log in again.")
                messageApi.open({
                    type: "success",
                    content: res.data.message,

                });
                navigate("/login");
            } else {
                message.error("Incorrect old password!!!")
                messageApi.open({
                    type: "error",
                    content: res.data.error,
                });
            }
        } catch (error: any) {
            console.error("Change Password Error:", error);
            messageApi.open({
                type: "error",
                content:
                    error?.response?.data?.message ||
                    "An error occurred. Please try again.",
            });
        }
    };

    return (
        <div className="grid-container">
            <ProfileฺBar />
            <main className="profile-main">
                <h1>Change Password</h1>
                <hr />
                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    {/* รหัสผ่านเก่า */}
                    <Form.Item
                        name="Password"
                        label="Old Password"
                        rules={[{ required: true, message: "Please enter your old password" }]}
                    >
                        <Input.Password placeholder="Enter old password" className="wide-input3" />
                    </Form.Item>

                    {/* รหัสผ่านใหม่ */}
                    <Form.Item
                        name="NewPassword"
                        label="New Password"
                        rules={[{ required: true, message: "Please enter your new password" }]}
                    >
                        <Input.Password placeholder="Enter new password" className="wide-input3" />
                    </Form.Item>

                    {/* ยืนยันรหัสผ่านใหม่ */}
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        dependencies={["NewPassword"]}
                        rules={[
                            { required: true, message: "Please confirm your new password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("NewPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm new password" className="wide-input3" />
                    </Form.Item>

                    <Form.Item>
                        <button type="submit" className="save-btn">
                            CONFIRM
                        </button>
                    </Form.Item>
                </Form>
            </main>
        </div>
    );
};

export default Password;

