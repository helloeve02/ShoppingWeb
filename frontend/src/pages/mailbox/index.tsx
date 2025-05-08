import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListMailBox, UpdateReadStatus } from "../../services/https";
import { MessageInterface, } from "../../interfaces/IHelpCenter";
import box from "../../assets/helpcenter/helpcenter.png"
import admin from "../../assets/helpcenter/helpcenter.png"
const MailBox: React.FC<{ ID: number }> = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageInterface | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await ListMailBox();
        const items = Array.isArray(response.data) ? response.data : [response.data];
        const userid = localStorage.getItem("id");
        const currentUserId = userid ? Number(userid) : null;
        if (!currentUserId) {
          return;
        }

        const filteredMessages = items
          .filter((item: any) => {
            const userId = item.user_id || item.UserID || item.user?.id;
            return userId === currentUserId;
          })
          .map((item: any) => ({
            id: item.ID,
            subject: item.HelpCenter?.subject,
            description: item.HelpCenter?.description,
            date: item.HelpCenterStatus?.UpdatedAt,
            Status: item.HelpCenterStatus?.status,
            image: item.HelpCenter?.image,
            UserName: item.user?.UserName,
            topic: item.HelpCenter?.topic_id,
            adminresponse: item.adminresponse,
            is_read: item.is_read,
          }));

        setMessages(filteredMessages);
      } catch (error) {
      }
    };

    fetchMessages();
  }, []);


  const handleSelectMessage = async (message: MessageInterface) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      try {
        const response = await UpdateReadStatus(message.id);
        if (response.status === 200) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === message.id ? { ...msg, is_read: true } : msg
            )
          );
        }
      } catch (error) {
      }
    }
  };


  const handleBackToHelpCenter = () => {
    navigate('/helpcenter');
  };

  return (
    <div className="min-h-screen bg-orange-100 flex">

      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center">
            <img src={box} alt="Mailbox Icon" className="mr-2 w-10 h-10" />
            Mailbox
          </h1>
        </div>
        <ul>
          {messages.map((message) => (
            <li
              key={message.id}
              className={`text-gray-900 p-4 border-b cursor-pointer hover:bg-white ${selectedMessage?.id === message.id ? "bg-white" : ""
                } ${message.is_read ? "bg-white text-gray-600" : "bg-gray-100 text-gray-900"
                }`}
              onClick={() => handleSelectMessage(message)}
            >
              <div>
                <h2 className="font-bold text-sm">{message.subject}</h2>
                <p className="text-sm">{new Date(message.date).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
                <h2 className="text-sm text-red-500">{message.Status}</h2>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="w-3/4 bg-white shadow-lg rounded-lg">
        {selectedMessage ? (
          <div className="p-10">
            <h2 className="text-2xl font-bold mb-3">{selectedMessage.subject}</h2>

            <div className="mb-5">
              <h2 className="text-lg font-semibold">{selectedMessage.UserName}</h2>
              <p className="text-sm text-red-500">Status: {selectedMessage.Status}</p>
            </div>

            <p className="text-gray-700 mb-5 leading-relaxed">{selectedMessage.description}</p>

            {/* Image */}
            {selectedMessage.image && (
              <img
                src={selectedMessage.image}
                alt="Message"
                className="max-w-[400px] w-full h-auto rounded-lg shadow-md mb-5"
              />
            )}

            {/* Admin Response */}
            <div className="flex justify-end mt-4">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={admin} />
                </div>
              </div>
              <div className="chat-header">
                Shoppo Admin
                <div className="relative bg-orange-100 text-black p-4 rounded-lg shadow-lg max-w-xs">
                  {selectedMessage.adminresponse}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-500 text-center">Select a topic to view details</p>
          </div>
        )}
      </div>


      {/* ปุ่มกลับไป Help Center */}
      <Button
        onClick={handleBackToHelpCenter}
        type="primary"
        icon={<LeftOutlined />}
        className="fixed bottom-4 left-4 flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-full shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out focus:ring-0 focus:outline-none"
        style={{
          background: 'linear-gradient(to right, #FFA500, #FF8C00)',
          outline: 'none',
          boxShadow: 'none',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #FF8C00, #FF4500)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #FFA500, #FF8C00)';
        }}
      >
        Back to Help Center
      </Button>
    </div>
  );
};

export default MailBox;
