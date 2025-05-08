import { useEffect, useState } from "react";
import { Alert, Checkbox, Form, Input, message, Select, Switch } from "antd";
import {
  InvoiceInterface,
  InvoiceTypeInterface,
} from "../../interfaces/Invoice";
import {
  CreateInvoice,
  GetInvoiceByUserID,
  GetInvoiceTypes,
} from "../../services/https";
import logo from "../../assets/shoppoicon.png";
import { useLocation, useNavigate } from "react-router-dom";

const RequestInvoice = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const user_id = localStorage.getItem("id");

  const [isRecordExisted, setIsRecordExisted] = useState<boolean>(false);
  const [isRecordChecked, setIsRecordChecked] = useState<boolean>(false);
  const [isRecordUsed, setIsRecordUsed] = useState<boolean>(false);
  const [types, setTypes] = useState<InvoiceTypeInterface[]>([]);

  const [invoiceType, setInvoiceType] = useState("");
  const [invoiceTypeID, setInvoiceTypeID] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [taxID, setTaxID] = useState("");

  const location = useLocation();
  const { selectedItems, CartById } = location.state || { selectedItems: [], CartById: [] };


  const getInvoiceTypes = async () => {
    try {
      const res = await GetInvoiceTypes();

      if (res.status === 200) {
        setTypes(res.data);
      } else {
        setTypes([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      setTypes([]);
      messageApi.error("Failed to fetch data");
    }
  };

  const getInvoiceByID = async (id: string) => {
    try {
      const res = await GetInvoiceByUserID(id);

      if (res.status === 200) {
        setIsRecordExisted(true);
        setInvoiceType(res.data.InvoiceType.Name);
        setFullName(res.data.FullName);
        setEmail(res.data.Email);
        setTaxID(res.data.TaxID);
        setInvoiceTypeID(res.data.InvoiceType.ID);
      } else {
        setIsRecordExisted(false);
      }
    } catch (error) {
      setTypes([]);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsRecordChecked(checked); // Update the state when switch is toggled
  };

  const handleSwitchChecked = (e: any) => {
    const checked = e.target.checked; // Extract the checked value
    if (checked) {
      form.setFieldsValue({
        InvoiceTypeID: invoiceTypeID,
        FullName: fullName,
        Email: email,
        TaxID: taxID,
      });
      setIsRecordUsed(checked);
    } else {
      form.resetFields(["InvoiceTypeID", "FullName", "Email", "TaxID"]);
      setIsRecordUsed(checked);
    }
  };

  const handleCancel = () => {
    navigate("/order", {
      state: { selectedItems, CartById },
    });
  };

  const onFinish = async (values: InvoiceInterface) => {
    if (isRecordChecked) {
      values.UserID = user_id ? parseInt(user_id) : 0; // Add UserID if Record switch is ON
    }

    const res = await CreateInvoice(values);

    if (res.status === 201 && res.data) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/order", {
          state: { selectedItems, CartById, invoiceData: res.data.invoiceID },
        });
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    if (user_id) {
      getInvoiceByID(user_id);
    }
    getInvoiceTypes();
  }, [user_id]);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col bg-gray-100">
        {/* Header section */}
        <div className="flex w-full min-h-[10vh] items-center bg-white">
          <div className="flex flex-row divide-x divide-orange-500 items-center max-w-7xl w-full mx-auto px-4">
            <div className="flex flex-row items-center gap-1 text-orange-500 text-[3vh] sm:text-[4vh] font-bold ">
              <img src={logo} className="object-cover h-[5vh] sm:h-[7vh]" />
              <h1>REQUEST INVOICE</h1>
            </div>
          </div>
        </div>
        {isRecordExisted === true && (
          <div className="flex max-w-7xl w-full mx-auto px-4 pt-[3vh]">
            <div className="bg-white h-auto w-full mx-auto flex flex-col px-[5vh] py-[3vh] rounded-lg shadow-lg">
              <h1 className="font-bold mb-3">Use your recorded information?</h1>
              <div className="flex flex-row gap-5">
                <Checkbox onChange={handleSwitchChecked} />
                <div>
                  <div>
                    Type: {invoiceType} Full Name: {fullName}
                  </div>
                  <div>
                    Email: {email} Tax ID: {taxID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Content Section */}
        <div className="flex max-w-7xl w-full mx-auto px-4 py-[3vh]">
          <div className="bg-white h-auto w-full mx-auto flex flex-col px-[5vh] py-[3vh] rounded-lg shadow-lg">
            <Form
              name="basic"
              form={form}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Alert
                className="mb-[3vh]"
                message="Warning!"
                description="Please ensure your information is correct."
                type="warning"
                showIcon
              />
              <Form.Item
                label="Type"
                name="InvoiceTypeID"
                rules={[{ required: true, message: "Please select type!" }]}
              >
                <Select
                  placeholder="Select type"
                  options={types.map((type) => ({
                    value: type.ID,
                    label: type.Name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="FullName"
                rules={[
                  { required: true, message: "Please enter your full name!" },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Tax ID"
                name="TaxID"
                rules={[
                  { required: true, message: "Please enter your tax id!" },
                  {
                    min: 13,
                    max: 13,
                    message: "Your Tax ID must be 13 characters",
                  },
                ]}
              >
                <Input
                  maxLength={13}
                  placeholder="Enter your Tax ID (13 Characters)"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
              {isRecordUsed === false && (
                <Form.Item label="Record" name="Record" valuePropName="checked">
                  <Switch onChange={handleSwitchChange} />
                </Form.Item>
              )}
              <Alert
                className="mb-[3vh]"
                message="We recommend you to record your information for next transaction."
                type="info"
                showIcon
              />
              {/* Submit Button Section */}
              <div className="flex gap-[1vh] ">
                <button
                  type="submit"
                  className="bg-orange-500 p-[1vh] hover:bg-orange-600 text-white rounded-md"
                >
                  Submit Request
                </button>
                <button className="bg-white text-orange-500 p-[1vh] ring-orange-500 ring-1 hover:bg-gray-100 rounded-md" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestInvoice;
