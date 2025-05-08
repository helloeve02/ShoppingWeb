import React, { useState, useEffect } from "react";
import { ArticlesInterface, TopicsInterface } from "../../interfaces/IHelpCenter";
import { Form, message, Modal, Select } from "antd";
import { Createarticles, DeleteArticle, GetTopics, ListArticles, UpdateArticle } from "../../services/https";
import play from "../../assets/helpcenter/play.png"

const ArticlePage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [form] = Form.useForm();
  const [topics, setTopics] = useState<TopicsInterface[]>([]);
  const [faqs, setFaqs] = useState<ArticlesInterface[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<String>();
  const [deletingArticle, setDeletingArticle] = useState<Number>();
  const [messageApi] = message.useMessage();

  const fetchFaqs = async () => {
    try {
      const response = await ListArticles()
      if (response.status === 200) {
        setFaqs(response.data);
      }
    } catch (error) {
    }
  };

  const onFinish = async () => {
    const articleId = form.getFieldValue("ArticleID");

    const newArticle = {
      title: title,
      content: content,
      topic_id: form.getFieldValue("TopicID"),
      id: articleId,
    };

    try {
      if (articleId) {
        const res = await UpdateArticle(articleId, newArticle);
        if (res.status === 200) {
          message.success("Article updated successfully!");
          form.resetFields();
          setTitle("");
          setContent("");
          fetchFaqs();
        }
      } else {
        const res = await Createarticles(newArticle);
        if (res.status === 200) {
          message.success("Article created successfully!");
          form.resetFields();
          setTitle("");
          setContent("");
          fetchFaqs();
        }
      }
    } catch (error) {
      message.error("Failed to submit article!");
    }
  };


  const onFinishFailed = () => {
    message.error("Form submission failed!");
  };

  const { Option } = Select;

  const getTopics = async () => {
    try {
      const res = await GetTopics()
      if (res.status === 200 && Array.isArray(res.data)) {
        setTopics(res.data);
      }
    } catch (error) {
    }
  };


  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await ListArticles()
        if (response.status === 200) {
          setFaqs(response.data);
        }
      } catch (error) {
      }
    };
    fetchFaqs();
  }, []);

  useEffect(() => {
    getTopics();
  }, []);

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

  const showModal = (val: ArticlesInterface) => {
    setModalText(
      `คุณต้องการลบข้อมูล "${val.title}" หรือไม่ ?`
    );
    setDeletingArticle(val.ID);
    setOpen(true);
  };

  const handleDelete = async () => {
    setConfirmLoading(true);
    let res = await DeleteArticle(deletingArticle);
    if (res.status) {
      setOpen(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      ListArticles();
    } else {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
    setConfirmLoading(false);
    fetchFaqs();
  };

  const handleCancelDelete = () => {
    setOpen(false);
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/*container */}
      <div className="flex justify-between w-full max-w-7xl mx-auto p-8">

        {/*creating a new article */}
        <div className="w-full lg:w-1/2 pr-4">
          <div className="w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create a New Article</h2>
            <div className="space-y-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>

                <Form.Item name="ArticleID" hidden>
                  <input type="hidden" />
                </Form.Item>

                {/* Title */}
                <Form.Item
                  label="Title"
                  name="Title"
                  rules={[{ required: true, message: "Please enter a title!" }]}
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter article title"
                  />
                </Form.Item>

                {/* Topic*/}
                <Form.Item
                  label="Topic"
                  name="TopicID"
                  rules={[{ required: true, message: "Please select a topic!" }]}
                >
                  <Select
                    placeholder="Select a topic"
                    allowClear
                    onChange={(value) => form.setFieldValue("TopicID", value)}
                  >
                    {topics.map((item) => (
                      <Option key={item.ID} value={item.ID}>
                        {item.topic}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Content */}
                <Form.Item
                  label="Content"
                  name="Content"
                  rules={[{ required: true, message: "Please enter the content!" }]}
                >
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter article content"
                    rows={6}
                  />
                </Form.Item>

                <button
                  className="w-full py-3 bg-orange-800 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Save Article
                </button>
              </Form>
            </div>
          </div>
        </div>

        {/*FAQ Section */}
        <div className="w-full lg:w-1/2 pl-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions</h2>
            <ul className="space-y-3">
              {faqs.map((article) => {
                if (article.ID === undefined) {
                  return null;
                }
                return (
                  <li key={article.ID} className="border-b pb-3">

                    {/* Title with toggle */}
                    <div className="flex items-center space-x-2">
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
                          className={`transform ${expandedFaqs.has(article.ID || 0) ? "rotate-90" : ""} w-3 h-3`}
                        />
                        <span>{article.title}</span>
                      </button>
                      <button
                        onClick={() => {
                          form.setFieldsValue({
                            ArticleID: article.ID,
                            Title: article.title,
                            Content: article.content,
                            TopicID: article.topic_id,
                          });
                          setTitle(article.title);
                          setContent(article.content);
                        }}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => {
                          if (article.ID !== undefined) {
                            showModal(article);
                          }
                        }}
                        className="text-red-500 hover:underline text-sm"
                      >
                        🗑️ Delete
                      </button>
                      <Modal
                        title="ลบข้อมูล ?"
                        open={open}
                        onOk={handleDelete}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancelDelete}
                      >
                        <p>{modalText}</p>
                      </Modal>
                    </div>
                    {expandedFaqs.has(article.ID) && (
                      <div className="mt-3">
                        <p className="text-gray-700 text-sm mb-4">{article.content}</p>

                      </div>
                    )}

                  </li>
                );
              })}
            </ul>

          </div>
        </div>

      </div>
    </div>
  );
}


export default ArticlePage;
