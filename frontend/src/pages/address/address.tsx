import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './address.css';
// import UserIcon from '../../../assets/icon-user.png';
import { Card, Col, Input, message, Modal, Form, Row, Radio, Popconfirm } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { AddressInterface } from '../../interfaces/Address';
import { GetAddressType, CreateAddress, GetAddressById, DeleteAddress, UpdateAddress, GetAddressByAddressId } from '../../services/https';
import { TypeInterface } from '../../interfaces/AddressType';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { UsersInterface } from '../../interfaces/IUser';
import ProfileฺBar from '../../components/profile/profile';


const AddAddress = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: any }>();
    const [type, setType] = useState<TypeInterface[]>([]);
    const userId = Number(localStorage.getItem("id"));
    const [form] = Form.useForm();
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const openModal1 = () => setIsModalOpen1(true);
    const closeModal1 = () => setIsModalOpen1(false);
    // const openModal2 = () => setIsModalOpen2(true);
    const closeModal2 = () => setIsModalOpen2(false);
    const [addresses, setAddresses] = useState<AddressInterface[]>([]);
    const [addressId, setAddressId] = useState<string | null>(null);


    const fetchAddresses = async () => {
        try {
            const res = await GetAddressById(id); // ดึงที่อยู่ตาม userId
            if (res.status === 200 && res.data) {
                setAddresses(res.data); // เก็บข้อมูลที่อยู่ใน state

            } else {
                message.open({
                    type: "error",
                    content: "Failed to fetch addresses!",
                });
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            message.open({
                type: "error",
                content: "An error occurred while fetching addresses.",
            });
        }
    };


    // console.log("Address data:", form.getFieldsValue());

    const onGetType = async () => {
        let res = await GetAddressType();
        if (res.status == 200) {
            setType(res.data);
        } else {
            message.open({
                type: "error",
                content: "Type not found!!!",
            });
            setTimeout(() => {
                navigate(`/address/${id}`);
            }, 2000);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields(); // Validate the form fields
            const valuesWithId = { ...values, UserID: userId }; // Add the userId to the form values

            // ตรวจสอบว่า user_id และ address_type_id ไม่เป็น null หรือ undefined
            if (!valuesWithId.UserID || !valuesWithId.AddressTypeID) {
                message.error('User ID and Address Type ID are required. ok');
                return;
            }

            await saveAddress(valuesWithId); // เรียกใช้ฟังก์ชัน saveAddress เพื่อนำข้อมูลไปบันทึก

            // หากข้อมูลถูกบันทึกสำเร็จ ปิด modal และรีเซ็ตฟอร์ม
            setIsModalOpen1(false);
            form.resetFields();

        } catch (errorInfo) {
            console.error("Validation Failed:", errorInfo);
            message.error('Please fill in all required fields.');
        }
    };

    const handleUpdate = async (id: any) => {
        try {
            const values = await form.validateFields(); // Validate form fields
            const valuesWithId = { ...values, UserID: userId }; // Add user_id to form values

            // Check if user_id and address_type_id are valid
            if (!valuesWithId.UserID || !valuesWithId.AddressTypeID) {
                message.error('User ID and Address Type ID are required. up');
                return;
            }
            try {
                await UpdateAddress(id, valuesWithId);
            } catch (error) {
                console.error("Update Failed:", error);
                message.error('Failed to update the address.');
            }

            // Check if addressId exists
            if (id != "") {
                // Call update function with the correct addressId
                await UpdateAddress(id, valuesWithId);
                message.success('Address updated successfully!');
                fetchAddresses();
            } else {
                message.error('Address ID is required for updating an address.');
                return;
            }

            // Close the modal and reset form after successful update
            setIsModalOpen2(false);
            form.resetFields();
        } catch (errorInfo) {
            console.error("Validation Failed:", errorInfo);
            message.error('Please fill in all required fields.');
        }


    };




    const handleDelete = async (id: any) => {
        const res = await DeleteAddress(id); // ลบที่อยู่ตาม id
        if (res.status === 200) {
            message.success("Address deleted successfully!");
            fetchAddresses(); // รีเฟรชข้อมูลที่อยู่หลังการลบ
        } else {
            message.error('Error deleting address!');
        }
    };

    const handleEditAddress = async (id: any) => {
        const res = await GetAddressByAddressId(id); // ดึงข้อมูลที่อยู่จาก id
        if (res.status === 200) {
            // กำหนดค่าฟอร์มจากข้อมูลที่ได้รับ
            form.setFieldsValue({
                Name: res.data.Name,
                Address: res.data.Address,
                SubDistrict: res.data.SubDistrict,
                District: res.data.District,
                Province: res.data.Province,
                PhoneNumber: res.data.PhoneNumber,
                PostalCode: res.data.PostalCode,
                AddressTypeID: res.data.AddressTypeID,
            });
        } else {
            message.error('Failed to fetch address!');
        }
    };


    const openModal2 = (id: string) => {
        handleEditAddress(id); // ดึงข้อมูลที่อยู่ที่ต้องการแก้ไข
        setIsModalOpen2(true);
        onGetType();
        setAddressId(id); // Set the selected address ID
    };


    // Example function to save address (you should implement this)
    const saveAddress = async (addressData: AddressInterface) => {
        // Your logic to save address data, e.g., API call
        let res = await CreateAddress(addressData);
        if (res.status = 200) {
            message.success("Address saved successfully!")
        } else {
            message.error('Address saved error!');
        }
        fetchAddresses();
    };

    const handleCancel = () => {
        // ปิด Popconfirm และแสดงข้อความยกเลิก
        message.info("Deletion canceled.");
    };

    // console.log("addresses: ",addresses.id)

    useEffect(() => {
        onGetType();
        // getAddressById(id);
        fetchAddresses();
    }, []);


    return (
        <div className="grid-container">
            <ProfileฺBar />
            <main className="profile-main">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h1>My Addresses</h1>
                    <button type="button" className="saves-btn" onClick={openModal1}>
                        <PlusOutlined style={{ marginRight: "8px" }} /> Add New Address
                    </button>
                </div>
                <hr />

                <div className="address-container">
                    {addresses.length > 0 ? (
                        <div className="address-grid">
                            {addresses.map((address, index) => (
                                <div key={index} className="address-card">
                                    <div className="address-info">
                                        <h4>{address.Name}, {type.find(item => item.ID === address.AddressTypeID)?.Type || "Unknown Type"}</h4>
                                        <p>{address.Address}</p>
                                        <p>
                                            {address.SubDistrict}, {address.District}, {address.Province} {address.PostalCode}
                                        </p>
                                        <p>Phone: {address.PhoneNumber}</p>
                                    </div>
                                    <div className="address-actions">
                                        <button className="edit-btn" onClick={() => openModal2(String(address.ID))}>
                                            <EditOutlined />
                                        </button>
                                        <Popconfirm
                                            title="Are you sure you want to delete this address?"
                                            onConfirm={() => handleDelete(String(address.ID))}
                                            onCancel={handleCancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <button className="delete-btn">
                                                <DeleteOutlined />
                                            </button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-address">No addresses available.</p>
                    )}
                </div>


                <Modal
                    title="New Address"
                    open={isModalOpen1}
                    onOk={handleOk}
                    okText="Save"
                    onCancel={closeModal1}
                >
                    <Card style={{ width: "100%", height: "100%", padding: "30px" }}>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form
                                    form={form}
                                    onFinish={handleOk}
                                >
                                    <Form.Item
                                        label="Type"
                                        name="AddressTypeID"
                                        rules={[{ required: true, message: "Please select your type!" }]}
                                    >
                                        <Radio.Group style={{ width: "100%" }}>
                                            {type && type.length > 0 ? (
                                                type.map((item) => (
                                                    <Radio key={item?.ID} value={item?.ID}>
                                                        {item.Type}
                                                    </Radio>
                                                ))
                                            ) : (
                                                <Radio disabled value={null}>
                                                    No options available
                                                </Radio>
                                            )}
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        label="Name"
                                        name="Name"
                                        rules={[
                                            { required: true, message: "Please input name!" },
                                            // { pattern: /^[a-zA-Zก-ฮ\s]+$/, message: "Name must contain only letters, Thai characters, and spaces." }
                                        ]}
                                    >
                                        <Input placeholder="Enter name" id="Name" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Address"
                                        name="Address"
                                        rules={[{ required: true, message: "Please input address!" }]}
                                    >
                                        <Input placeholder="Enter address" id="Address" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Sub District"
                                        name="SubDistrict"
                                        rules={[
                                            { required: true, message: "Please input sub district!" },
                                            // { pattern: /^[ก-ฮa-zA-Z]+$/, message: "Sub-District must contain only letters." }
                                        ]}
                                    >
                                        <Input placeholder="Enter sub district" id="SubDistrict" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="District"
                                        name="District"
                                        rules={[
                                            { required: true, message: "Please input district!" },
                                            // { pattern: /^[ก-ฮa-zA-Z]+$/, message: "District must contain only letters." }
                                        ]}
                                    >
                                        <Input placeholder="Enter district" id="District" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Province"
                                        name="Province"
                                        rules={[
                                            { required: true, message: "Please input province!" },
                                            // { pattern: /^[ก-ฮa-zA-Z]+$/, message: "Province must contain only letters." }
                                        ]}
                                    >
                                        <Input placeholder="Enter province" id="Province" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Postal Code"
                                        name="PostalCode"
                                        rules={[
                                            { required: true, message: "Please input postal code!" },
                                            { pattern: /^\d{5}$/, message: "Postal code must be exactly 5 digits." }
                                        ]}
                                    >
                                        <Input placeholder="Enter postal code" id="PostalCode" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Phone Number"
                                        name="PhoneNumber"
                                        rules={[
                                            { required: true, message: "Please input your phone number!" },
                                            { pattern: /^[0]\d{9}$/, message: "Phone number must be exactly 10 digits and start with '0'!" }
                                        ]}
                                    >
                                        <Input placeholder="Enter phone number" id="PhoneNumber" autoComplete="off" />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>

                <Modal
                    title="Edit Address"
                    open={isModalOpen2}
                    onOk={() => handleUpdate(addressId)} // Pass addressId here
                    okText="Save"
                    onCancel={closeModal2}
                >
                    <Card style={{ width: "100%", height: "100%", padding: "30px" }}>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form
                                    form={form}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Type"
                                        name="AddressTypeID"
                                        rules={[{ required: true, message: "Please select your type!" }]}
                                    >
                                        <Radio.Group style={{ width: "100%" }}>
                                            {type && type.length > 0 ? (
                                                type.map((item) => (
                                                    <Radio key={item?.ID} value={item?.ID}>
                                                        {item?.Type}
                                                    </Radio>
                                                ))
                                            ) : (
                                                <Radio disabled value={null}>
                                                    No options available
                                                </Radio>
                                            )}
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        label="Name"
                                        name="Name"
                                        rules={[
                                            { required: true, message: "Please input name!" },
                                            // { pattern: /^[a-zA-Zก-ฮ\s]+$/, message: "Name must contain only letters, Thai characters, and spaces." }
                                        ]}
                                    >
                                        <Input placeholder="Enter name" id="Name" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Address"
                                        name="Address"
                                        rules={[{ required: true, message: "Please input address!" }]}
                                    >
                                        <Input placeholder="Enter address" id="Address" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Sub District"
                                        name="SubDistrict"
                                        rules={[
                                            { required: true, message: "Please input sub district!" },
                                            // { pattern: /^[ก-ฮa-zA-Z]+$/, message: "Sub-District must contain only letters." }
                                        ]}
                                    >
                                        <Input placeholder="Enter sub district" id="SubDistrict" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="District"
                                        name="District"
                                        rules={[
                                            { required: true, message: "Please input district!" },
                                            // { pattern: /^[ก-ฮa-zA-Z]+$/, message: "District must contain only letters." }
                                        ]}
                                    >
                                        <Input placeholder="Enter district" id="District" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Province"
                                        name="Province"
                                        rules={[
                                            { required: true, message: "Please input province!" },
                                            // { pattern: /^[ก-ฮa-zA-Z]+$/, message: "Province must contain only letters." }
                                        ]}
                                    >
                                        <Input placeholder="Enter province" id="Province" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Postal Code"
                                        name="PostalCode"
                                        rules={[
                                            { required: true, message: "Please input postal code!" },
                                            { pattern: /^\d{5}$/, message: "Postal code must be exactly 5 digits." }
                                        ]}
                                    >
                                        <Input placeholder="Enter postal code" id="PostalCode" autoComplete="off" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Phone Number"
                                        name="PhoneNumber"
                                        rules={[
                                            { required: true, message: "Please input your phone number!" },
                                            { pattern: /^[0]\d{9}$/, message: "Phone number must be exactly 10 digits and start with '0'!" }
                                        ]}
                                    >
                                        <Input placeholder="Enter phone number" id="PhoneNumber" autoComplete="off" />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                </Modal>

            </main>
        </div>
    );
};

export default AddAddress;

