import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { ListMailBox, ListMailBoxStatus, ResponseMailBox } from "../../services/https";
import { HelpCenterStatusInterface, MessageInterface } from "../../interfaces/IHelpCenter";
import bax from "../../assets/helpcenter/helpcenter.png"
const { Option } = Select;

const AdminMailBox: React.FC<{ ID: number }> = () => {
  const [mailboxstatus, setMailBoxStatus] = useState<HelpCenterStatusInterface[]>([]);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageInterface | null>(null);
  const [, setValues] = useState([{ AdminResponse: '', Status: '' }]);
  const [form] = Form.useForm();


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await ListMailBox();
        if (response.data && Array.isArray(response.data)) {
          setValues(response.data);
          const messagesFromAPI = response.data.map((item: any) => ({
            id: item.ID,
            subject: item.HelpCenter.subject,
            description: item.HelpCenter.description,
            date: item.HelpCenter.date,
            Status: item.HelpCenterStatus.status,
            image: item.HelpCenter.image,
            UserName: item.HelpCenter.User.UserName,
            topic: item.HelpCenter.Topic.topic,
          }));

          setMessages(
            messagesFromAPI.sort((a: any, b: any) => {
              const statusA = a.Status.toLowerCase().trim();
              const statusB = b.Status.toLowerCase().trim();

              if (statusA === "in progress" && statusB !== "in progress") return -1; // a comes first
              if (statusB === "in progress" && statusA !== "in progress") return 1;  // b comes first
              return 0;
            })
          );
        }
      } catch (error) {
      }
    };

    fetchMessages();

    const fetchMailBoxStatus = async () => {
      try {
        const response = await ListMailBoxStatus();

        if (Array.isArray(response.data)) {
          const parsedStatuses = response.data.map((item: any) => ({
            ID: item.ID,
            status: item.status,
          }));

          setMailBoxStatus(parsedStatuses);
        }
      } catch (error) {
      }
    };
    fetchMailBoxStatus();
  }, []);

  const handleSelectMessage = async (message: MessageInterface) => {
    setSelectedMessage(message);

    if (!message.id) {
      return;
    }
  };

  const handleSubmitResponse = async (values: any) => {
    const statusValue = values.status;

    if (!selectedMessage || selectedMessage.id === 0) {
      message.error("Invalid message selected.");
      return;
    }

    if (statusValue === 1) {
      message.warning("Please select 'Success' before submitting.");
      return;
    }

    try {
      await ResponseMailBox(selectedMessage.id, values.AdminResponse, statusValue);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === selectedMessage.id
            ? {
              ...msg,
              Status: mailboxstatus.find((item) => item.ID === statusValue)?.status || msg.Status,
            }
            : msg
        )
      );

      form.resetFields();
      setSelectedMessage(null);

      message.success("Form submitted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.error || "An error occurred.");
      } else {
        message.error("An unknown error occurred.");
      }
    }
  };


  const onFinishFailed = () => {
    message.error("Form submission failed!");
  };

  return (
    <div className="min-h-screen bg-orange-100 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center">
            <img src={bax} alt="Mailbox Icon" className="mr-2 w-10 h-10" />
            Mailbox
          </h1>
        </div>
        <ul>
          {messages.map((message) => (
            <li
              key={message.id}
              className={`text-gray-900 p-4 border-b cursor-pointer hover:bg-white ${selectedMessage?.id === message.id ? "bg-white" : ""
                }`}
              onClick={() => handleSelectMessage(message)}
            >
              <div>
                <h2 className="font-bold text-sm">{message.topic}</h2>
                <h2 className="text-sm">{message.subject}</h2>
                <h2 className="text-sm text-red-500">{message.Status}</h2>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="w-full sm:w-3/4 lg:w-3/4 bg-white">
        {selectedMessage ? (
          <div className="p-6 space-y-4">

            {/* Header */}
            <div className="border-b pb-4">
              <h2 className="text-2xl font-semibold">{selectedMessage.subject}</h2>
              <h2 className="text-md text-gray-500">By: {selectedMessage.UserName}</h2>
              <h2 className="text-sm text-red-500">Status: {selectedMessage.Status}</h2>
            </div>

            {/* Message Description */}
            <div className="space-y-4">
              <p className="text-m">{selectedMessage.description}</p>
              {selectedMessage.image && (
                <img
                  src={selectedMessage.image}
                  alt="Attached"
                  className="h-auto rounded-lg shadow-md"
                />
              )}
            </div>

            {/* Reply Form */}
            <div className="flex flex-col mt-8 space-y-4">
              <Form form={form} onFinish={handleSubmitResponse} onFinishFailed={onFinishFailed} className="space-y-4">
                <Form.Item
                  name="AdminResponse"
                  rules={[{ required: true, message: "Please provide a response!" }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Write your response..."
                    className="p-4 border border-gray-300 rounded-lg text-lg"
                    disabled={selectedMessage?.Status === "Success"}
                  />
                </Form.Item>
                <Form.Item name="status" rules={[{ required: true, message: "Please select a status!" }]}>
                  <Select placeholder="Select Status" className="w-full" disabled={selectedMessage?.Status === "Success"}>
                    {mailboxstatus.map((item) => (
                      <Option key={item.ID} value={item.ID}>
                        {item.status}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="px-8 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md"
                    disabled={selectedMessage?.Status === "Success"}
                  >
                    Send Response
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-500 text-center">Select a topic to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminMailBox;
