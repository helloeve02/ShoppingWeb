import React, { useState, useEffect } from "react";
import { Form, Input, message, DatePicker, Radio } from "antd";
import { UsersInterface } from "../../interfaces/IUser";
import { GetUserById, UpdateUserByid, GetGender } from "../../services/https";
import { useNavigate, useParams } from "react-router-dom";
import './profile.css';
import ProfileฺBar from "../../components/profile/profile";
import dayjs from "dayjs";
import { GenderInterface } from "../../interfaces/Gender";

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();
    const [messageApi] = message.useMessage();
    const [gender, setGender] = useState<GenderInterface[]>([]);
    const [form] = Form.useForm();

    const onGetGender = async () => {
        let res = await GetGender();
        if (res.status == 200) {
            setGender(res.data);
        } else {
            messageApi.open({
                type: "error",
                content: "Gender not found!!!",
            });
            setTimeout(() => {
                navigate(`/profile/${id}`);
            }, 2000);

        }

    }; //close

    const getUserById = async (id: string) => {
        let res = await GetUserById(id);
        if (res.status === 200) {
            form.setFieldsValue({
                UserName: res.data.UserName,
                firstname: res.data.FirstName,
                lastname: res.data.LastName,
                email: res.data.Email,
                Phone: res.data.Phone,
                birthday: dayjs(res.data.birthday),
                gender_id: res.data.gender?.ID,
            });
        } else {
            messageApi.open({
                type: "error",
                content: "Username not found!!!",
            });
            setTimeout(() => {
                navigate(`/profile/${id}`);
            }, 2000);
        }
    };


    const onFinish = async (values: UsersInterface) => {
        let payload = {
            ...values,
        };

        const res = await UpdateUserByid(id, payload);
        if (res.status == 200) {
            message.success("User updated successfully!")
            messageApi.open({
                type: "success",
                content: res.data.message,
            });
        } else {
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    const [genderId] = useState<string | undefined>(undefined);
    useEffect(() => {
        onGetGender();
        getUserById(id);
    }, [genderId]);

    // console.log("Gender data:", gender);
    // console.log("User data:", form.getFieldsValue()); //close


    return (
        <div className="grid-container">
            <ProfileฺBar />
            <main className="profile-main">
                <h1>My Profile</h1>
                <hr />
                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="UserName"
                    >
                        <Input readOnly />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="firstname"
                        rules={[{ required: true, message: "First name is required!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastname"
                        rules={[{ required: true, message: "Last name is required!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email is required!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="Phone"
                        rules={[
                            { required: true, message: "Phone number is required!" },
                            { pattern: /^[0]\d{9}$/, message: "Phone number must be 10 digits starting with 0" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender_id"
                        rules={[{ required: true, message: "Please select your gender!" }]}
                    >
                        <Radio.Group style={{ width: "100%" }}>
                            {gender && gender.length > 0 ? (
                                gender.map((item) => (
                                    <Radio key={item.ID} value={item.ID}>
                                        {item.gender}
                                    </Radio>
                                ))
                            ) : (
                                <Radio disabled value={null}>
                                    No gender options available
                                </Radio>
                            )}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Birthday"
                        name="birthday"
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <button type="submit" className="save-btn">Save</button>
                </Form>
            </main>
        </div >
    );
};

export default Profile;