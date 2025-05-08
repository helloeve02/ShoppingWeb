import React, { useState, useEffect } from "react";
import { Upload, Button, message, Form, Input } from "antd";
import { FaHome, FaDollarSign } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import bankImage from "../../assets/dpa_bank_kbank@2x.png";
import { CreatePayment } from "../../services/https";

export interface PaymentInterface {
  Amount: number;
  PaymentDate: string;
  PayerName: string;
  PaymentImage: File | null;
}

const Payment: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // Track file list in state
  const [showBankDetails, setShowBankDetails] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const handleAmountChange = (value: string) => {
    const isValidAmount = parseFloat(value) >= 50;
    setShowBankDetails(isValidAmount);
    if (!isValidAmount) {
      message.warning("Amount must be at least 50 to proceed.");
    }
  };

  const handleFileChange = (info: any) => {
    const { fileList } = info;

    if (fileList.length > 1) {
      fileList.shift(); // Remove the previous file if more than one file is selected
    }

    // Check if the file is valid
    const selectedFile = fileList[0]?.originFileObj;

    if (!selectedFile) {
      message.error("No file provided. Please try again.");
      return;
    }

    // Validate file type
    const isJpgOrPng =
      selectedFile.type === "image/jpeg" || selectedFile.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return;
    }

    // Validate file size
    const isLt2M = selectedFile.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    // Set the file into state
    setFileList(fileList);

    // Update form field value to ensure the file is captured by Ant Design form validation
    form.setFieldsValue({ proofOfPayment: selectedFile });
  };

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Please upload a proof of payment.");
      return;
    }

    const paymentDate = new Date(values.transferTime);
    const formattedDate = paymentDate.toISOString().split("Z")[0];
    const PaymentStatusID = 1; // Assuming 1 is the ID for the "Pending" status
    const formData = new FormData();
    formData.append("Amount", values.amount);
    formData.append("PaymentDate", formattedDate);
    formData.append("PayerName", values.payerName);
    formData.append("file", fileList[0]?.originFileObj); // Assuming fileList contains the uploaded image
    formData.append("UserID", String(userId));  // Assuming values.UserID contains the user ID
    formData.append("PaymentStatusID", String(PaymentStatusID)); // Append the PaymentStatusID, not PaymentStatus

    try {
      const response = await CreatePayment(formData);

      // Check if the response contains an error message or unexpected structure
      if (response.status === 201) {
        // Successful response
        message.success("Payment details submitted successfully!");
        form.resetFields();
        setFileList([]); // Reset the file list state
        navigate(`/wallet/${userId}`);
      } else {
        // If status is 201 but the response content indicates an error, handle it here
        console.error("Unexpected response:", response);
        message.error(`Failed to submit payment. Status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error during payment submission:", error);

      // Log the error response for debugging
      if (error.response) {
        console.error("Error response:", error.response);
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        message.error(`Error: ${errorMessage}`);
      } else {
        message.error("An unexpected error occurred.");
      }
    }
  };



  useEffect(() => {
    // ดึงข้อมูลจาก Local Storage
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <div className="bg-white-600 flex justify-center items-center w-full">
      <div className="ant-card-body flex flex-col w-full max-w-5xl p-6 rounded shadow-lg">
        <div className="flex-1 p-6 max-w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-full">
            {/* Header Section */}
            <div className="border-0 p-4 rounded-lg bg-red-500 flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <FaDollarSign className="text-yellow-500" />
                Payment
              </h2>
              <Link to="/home">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-700 text-white rounded-md shadow-sm hover:bg-red-800">
                  <FaHome className="text-lg" />
                  Home
                </button>
              </Link>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ amount: "", payerName: "", transferTime: "" }}
            >
              {/* Payment Amount */}
              <Form.Item
                label="Payment Amount"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Please input the payment amount!",
                  },
                  {
                    validator: (_, value) =>
                      value && parseFloat(value) >= 50
                        ? Promise.resolve()
                        : Promise.reject(
                          "Amount must be 50 or more to proceed!"
                        ),
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter amount"
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </Form.Item>

              {/* Bank Account Details */}
              {showBankDetails && (
                <div className="w-full border border-gray-300 p-4 rounded-lg bg-gray-100 mt-4">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={bankImage}
                      alt="Bank"
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <h3 className="text-lg mb-3 text-black font-semibold">
                        Bank Details
                      </h3>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Account Number:
                        </span>
                        <div className="text-sm text-gray-800 font-semibold">
                          123-456-7890
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">
                          Account Name:
                        </span>
                        <div className="text-sm text-gray-800 font-semibold">
                          Shoppoo Online
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payer Details */}
              {showBankDetails && (
                <>
                  <Form.Item
                    label="Full Name"
                    name="payerName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your full name!",
                      },
                      {
                        validator: (_, value) =>
                          value && value.trim().split(" ").length >= 2
                            ? Promise.resolve()
                            : Promise.reject(
                              "Full name must include both first name and last name."
                            ),
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name (e.g., John Doe)" />
                  </Form.Item>

                  <Form.Item
                    label="Transfer Time"
                    name="transferTime"
                    rules={[
                      {
                        required: true,
                        message: "Please input the transfer time!",
                      },
                    ]}
                  >
                    <Input type="datetime-local" />
                  </Form.Item>

                  {/* File Upload */}
                  <Form.Item
                    label="Proof of Payment"
                    name="proofOfPayment"
                    rules={[
                      {
                        required: true,
                        message: "Please upload proof of payment!",
                      },
                    ]}
                  >
                    <Upload
                      beforeUpload={() => false} // Prevent automatic upload
                      onChange={handleFileChange}
                      listType="picture"
                      maxCount={1}
                      fileList={fileList} // Use fileList to control selected files
                      showUploadList={{
                        showRemoveIcon: true,
                      }}
                    >
                      <Button>Upload Image</Button>
                    </Upload>
                  </Form.Item>
                </>
              )}

              <Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!showBankDetails}
                  onClick={handleSubmit} // Add onClick handler
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
