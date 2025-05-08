import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UsersInterface } from "../../../interfaces/IUser";
import { UpdateUserByid, GetUserById } from "../../../services/https/index";
import { useNavigate } from "react-router-dom";

const SellerRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false); // Loading state for the button
    const userid = localStorage.getItem("id");

    const getUserById = async (userid: string) => {
        try {
            const res = await GetUserById(userid);
            console.log(res);
            if (res.status === 200) {
                // Set the form fields using the response data
                form.setFieldsValue({
                    firstName: res.data.FirstName || "",
                    lastName: res.data.LastName || "",
                    email: res.data.Email || "",
                    phoneNumber: res.data.Phone || "",
                    storeName: res.data.store_name || "",
                    pickupAddress: res.data.pickup_address || "",
                });
            } else {
                message.error("User data not found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            message.error("An error occurred while loading user data.");
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload: UsersInterface = {
                store_name: values.storeName,
                pickup_address: values.pickupAddress,
                seller: true,
            };
            const response = await UpdateUserByid(userid || "", payload);
            if (response.status === 200) {
                message.success("User updated successfully!");
                navigate("/sellercenter");
            } else {
                message.error("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userid) {
            getUserById(userid);
        }
    }, [userid]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-200 p-6">
            <div className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
                    Seller Registration
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        storeName: "",
                        pickupAddress: "",
                        email: "",
                        phoneNumber: "",
                    }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* First Name */}
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[{ required: true, message: "Please input your first name!" }]}
                        >
                            <Input
                                placeholder="Enter first name"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>

                        {/* Last Name */}
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[{ required: true, message: "Please input your last name!" }]}
                        >
                            <Input
                                placeholder="Enter last name"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>

                        {/* Email */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email!" },
                                { type: "email", message: "Please enter a valid email!" },
                            ]}
                        >
                            <Input
                                placeholder="Enter email"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>

                        {/* Phone Number */}
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[{ required: true, message: "Please input your phone number!" }]}
                        >
                            <Input
                                placeholder="Enter phone number"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>

                        {/* Store Name */}
                        <Form.Item
                            label="Store Name"
                            name="storeName"
                            rules={[{ required: true, message: "Please input your store name!" }]}
                        >
                            <Input
                                placeholder="Enter store name"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>

                        {/* Pickup Address */}
                        <Form.Item
                            label="Pickup Address"
                            name="pickupAddress"
                            rules={[{ required: true, message: "Please input your pickup address!" }]}
                        >
                            <Input
                                placeholder="Enter pickup address"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </Form.Item>
                    </div>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md mt-6 transition-all duration-300"
                            loading={loading} // Adds loading spinner
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default SellerRegistration;
