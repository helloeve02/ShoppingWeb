import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Button, Form, Input, message, Select, Upload, DatePicker, Modal } from 'antd';
import MyAccountIcon from '../../assets/helpcenter/topics/MyAccount.png';
import PaymentsIcon from '../../assets/helpcenter/topics/Payments.png';
import RefundsIcon from '../../assets/helpcenter/topics/Refunds.png';
import ShippingIcon from '../../assets/helpcenter/topics/Shipping.png';
import MailboxIcon from "../../assets/helpcenter/mailbox.png";
import HelpCenterIcon from "../../assets/helpcenter/helpcenter.png";
import { CreateHelpCenterForm, GetTopics, ListArticles, ListMailBox } from "../../services/https";
import { ArticlesInterface, HelpCenterInterface, TopicsInterface } from "../../interfaces/IHelpCenter";
import dayjs from "dayjs";
import qanda from "../../assets/helpcenter/Q and A.png"
import helpicon from "../../assets/helpcenter/helpcenter.png"
import play from "../../assets/helpcenter/helpcenter.png"
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const userid = localStorage.getItem("id")

const HelpPage: React.FC = () => {
  const [topics, setTopics] = useState<TopicsInterface[]>([]);
  const navigate = useNavigate();
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [faqs, setFaqs] = useState<ArticlesInterface[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const [, setHasNewMessages] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setLoading] = useState(true);

  const topicIcons: Record<number, string> = {
    1: MyAccountIcon,
    2: PaymentsIcon,
    3: RefundsIcon,
    4: ShippingIcon,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await getTopics();
        await fetchMessages();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const [form] = Form.useForm();

  const goToMailbox = () => {
    navigate("/mailbox");
  };

  const { Option } = Select;

  const getTopics = async () => {
    try {
      const res = await GetTopics();
      if (res.status === 200 && Array.isArray(res.data)) {
        const topicsWithIcons = res.data.map((topic: TopicsInterface) => ({
          ...topic,
          icon: topic.ID ? topicIcons[topic.ID] : "",
        }));
        setTopics(topicsWithIcons);
      }
    } catch (error) {
    }
  };

  useEffect(() => {

    // ดึงข้อมูล FAQ
    const fetchFaqs = async () => {
      try {
        const response = await ListArticles();
        if (response.status === 200) {
          setFaqs(response.data);
        }
      } catch (error) {
      }
    };
    fetchFaqs();

  }, []);

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

      const newMessages = filteredMessages.some(
        (message: any) => message.is_read === false && message.Status === "Success"
      );

      setHasNewMessages(newMessages);
    } catch (error) {
    }
  };

  useEffect(() => {
    getTopics();
    fetchMessages();
  }, []);

  const filteredFaqs = selectedTopicId
    ? faqs.filter((article) => article.topic_id === selectedTopicId)
    : faqs;

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: HelpCenterInterface) => {
    const imageUrl = values.image = fileList[0]?.thumbUrl || "";
    const date = values.date ? dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss[Z]") : undefined;

    const formattedValues = {
      ...values,
      user_id: Number(userid),
      image: imageUrl,
      topic_id: values.TopicID,
      date: date,
    };

    if (!formattedValues.topic_id) {
      messageApi.error("Selected topic is invalid. Please select a valid topic.");
      return;
    }

    try {
      await CreateHelpCenterForm(formattedValues);

      setOpen(false);
      form.resetFields();
      setFileList([]);
      message.success("Form submitted successfully!");
    } catch (error) {
      messageApi.error("Something went wrong. Please try again.");
    }
  };

  const onFinishFailed = () => {
    message.error("Form submission failed!");
  };


  const handleCancel = () => {
    setOpen(false);
  };

  const toggleFaq = (id: number) => {
    setExpandedFaqs((prevExpandedFaqs) => {

      const updatedFaqs = new Set(prevExpandedFaqs);

      if (updatedFaqs.has(id)) {
        updatedFaqs.delete(id);
      } else {
        updatedFaqs.add(id);
      }

      return updatedFaqs;
    });
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col ">

      {/* Header */}
      <div className="grid grid-rows-2 min-h-screen">

        {/* bg ด้านบน */}
        <div className="w-full relative bg-gradient-to-r from-orange-600 to-orange-300 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">Hi, How can we help?</h1>
        </div>

        {/* Topics Section */}
        <div className="mx-32 mt-5 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-gray-800 ">Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.topic}
                className="flex flex-col items-center"
                onClick={() => setSelectedTopicId(topic.ID)}
              >
                <div
                  className="w-16 h-16 flex items-center justify-center bg-orange-100 text-4xl rounded-full shadow-md hover:bg-orange-200 transition-transform duration-200 transform hover:scale-110"
                >
                  <img
                    src={topic.icon}
                    alt={topic.topic}
                    className="w-10 h-10"
                  />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-800">{topic.topic}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Q Section */}
        <div className="mx-32 mt-5 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center ">
            Questions
            <img
              src={qanda}
              alt="Questions"
              className="ml-2 w-10 h-10"
            />
          </h2>
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {filteredFaqs.map((article) => (
              <li key={article.ID} className="border-b pb-3">
                <button
                  onClick={() => {
                    if (article.ID !== undefined) {
                      toggleFaq(article.ID);
                    }
                  }}
                  className="text-left w-full hover:underline text-sm font-medium text-gray-800 flex items-center space-x-2"
                >
                  <img
                    src={play}
                    alt="Arrow icon"
                    className={`transform ${expandedFaqs.has(article.ID || 0) ? 'rotate-90 ' : ''
                      } w-3 h-3 `}
                  />
                  <span>{article.title}</span>
                </button>
                {article.ID !== undefined && expandedFaqs.has(article.ID) && (
                  <p className="mt-2 text-gray-700 text-sm">{article.content}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* mailbox */}
        <div className="fixed bottom-5 right-5">
          <button
            onClick={goToMailbox}
            className="flex items-center justify-center w-20 h-20 bg-white shadow-lg rounded-full hover:bg-gray-200 transition-transform duration-200 transform hover:scale-110"
          >
            <img src={MailboxIcon} alt="Mailbox Icon" className="w-15 h-15" />
            {messages.filter((msg) => !msg.is_read && msg.Status === "Success").length > 0 && (
              <div className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                {messages.filter((msg) => !msg.is_read && msg.Status === "Success").length}
              </div>
            )}
          </button>
        </div>

        {/* Contact Help Center */}
        <div className="mt-12 flex flex-col items-center">

          <div className="flex items-center w-full">
            <div className="mx-20 flex-1 border-t border-gray-300" />
            <p className="text-gray-600 whitespace-nowrap">Still Need Help?</p>
            <div className="mx-20 flex-1 border-t border-gray-300" />
          </div>
          <div className="flex items-center space-x-2 mb-5">
            <img src={HelpCenterIcon} alt="HelpCenter Icon" className="mt-4 w-10 h-10" />
            <button onClick={showModal} className="mt-3 py-2 px-4 text-black border border-gray-300 rounded-lg bg-white ">
              Shoppo Help Center
            </button>
          </div>
        </div>

        {contextHolder}
        {/* แบบฟอร์ม */}
        <Modal
          title={
            <div className="flex items-center">
              <img
                src={helpicon}
                alt="Help Center Icon"
                className="w-6 h-6 mr-2" />
              Shoppo HelpCenter
            </div>
          }

          open={open}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button type="primary" onClick={() => form.submit()}>
              Submit
            </Button>,
          ]}
        >
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ variant: 'filled' }}>

            <p>กรุณากรอกรายละเอียดปัญหาที่คุณต้องการความช่วยเหลือ ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด</p>

            <Form.Item
              className="mt-5"
              label="topic"
              name="TopicID"
              rules={[{ required: true, message: "Please select a topic!" }]}
            >
              <Select allowClear>
                {topics.map((item) => (
                  <Option key={item.ID} value={item.ID}>
                    {item.topic}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="subject"
              name="subject"
              rules={[{ required: true, message: 'Please input Subject!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="description"
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Upload File"
              name="uploadFile"
              rules={[{ required: true, message: "Please upload a file!" }]}
            >
              <div className="flex justify-end">
                <Upload
                  id={"image"}
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  maxCount={1}
                  multiple={false}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>
                    Click to Upload
                  </Button>
                </Upload>
              </div>
            </Form.Item>

            <Form.Item
              label="date"
              name="date"
              rules={[{ required: true, message: 'Please input!' }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => {
                  const currentDate = dayjs();
                  const isAfterToday = current.isAfter(currentDate.startOf('day'));
                  return isAfterToday;
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>

  )
}
export default HelpPage;