import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  ReturnInterface,
  ReturnReasonInterface,
  ReturnTypeInterface,
} from "../../interfaces/Return";
import {
  CreateReturn,
  GetReturnReasons,
  GetReturnTypes,
  GetShopNameByUserID,
  ReturnOrder,
} from "../../services/https";
import logo from "../../assets/shoppoicon.png";
import promo from "../../assets/promo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CustomerReturnPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderItem } = location.state || {};

  const UserID = localStorage.getItem("id");
  const [shopName, setShopName] = useState("");

  const [types, setTypes] = useState<ReturnTypeInterface[]>([]);
  const [reasons, setReasons] = useState<ReturnReasonInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
    form.validateFields(["ProvingImage"]);

    const updatedFileList = [...newFileList];

    if (updatedFileList.length > 0) {
      updatedFileList[0].status = "done";
    }
  };

  const isBase64 = (str: string) => {
    const base64Regex = /^([A-Za-z0-9+\/=]|\n|\r)+$/;
    return base64Regex.test(str);
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return promo;

    if (isBase64(image)) {
      return `data:image/jpeg;base64,${image}`;
    }

    return image.startsWith("http")
      ? image
      : `https://mediam.dotlife.store/media/cata/${image}`;
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleReturnClick = (id: any) => {
    ReturnOrder(id);
  };

  const getReturnTypes = async () => {
    try {
      const res = await GetReturnTypes();

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

  const getReturnReasons = async () => {
    try {
      const res = await GetReturnReasons();

      if (res.status === 200) {
        setReasons(res.data);
      } else {
        setReasons([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      setReasons([]);
      messageApi.error("Failed to fetch data");
    }
  };

  const getShopNameByUserID = async (id: string) => {
    try {
      const res = await GetShopNameByUserID(id);
      if (res.status === 200) {
        setShopName(res.data)
      }
    } catch (error) {
      messageApi.error("Failed to fetch shop name");
      setShopName("")
    }
  };

  const onFinish = async (values: ReturnInterface) => {
    values.ProvingImage = fileList[0]?.thumbUrl;
    values.UserID = UserID ? parseInt(UserID) : 0;
    values.OrderID = orderItem[0]?.OrderID;
    const res = await CreateReturn(values);

    if (res.status === 201) {
      handleReturnClick(orderItem[0].OrderID);
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getReturnTypes();
    getReturnReasons();
    getShopNameByUserID(orderItem[0].Product?.user_id)
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col">
        {/* Header section */}
        <div className="flex w-full min-h-[10vh] items-center border-b bg-white">
          <div className="flex flex-row divide-x divide-orange-500 items-center max-w-7xl w-full mx-auto px-4">
            <div className="flex flex-row gap-1 items-center text-orange-500 text-[3vh] sm:text-[4vh] font-bold ">
              <img src={logo} className="object-cover h-[5vh] sm:h-[7vh]" />
              <h1>RETURN / REFUND</h1>
            </div>
          </div>
        </div>
        {/* Content Section */}
        <div className="flex max-w-7xl w-full mx-auto px-4 py-[3vh]">
          <div className="bg-white h-auto w-full mx-auto flex flex-col px-[5vh] py-[3vh] rounded-lg shadow-lg">
            <div className="divide-y divide-gray-200">
              {/* Shop Section */}
              <div className="flex flex-row items-center mb-[1vh]">
                <strong>{shopName}</strong>
              </div>
              {/* Item Section */}
              <div className="divide-y divide-gray-200">
                {orderItem.map((item: any) => (
                  <div className="flex flex-row py-[2vh] px-[3vh] items-center">
                    <img
                      src={getImageUrl(
                        item.Product?.product_images?.[0]?.image || ""
                      )}
                      className="object-cover h-[10vh] w-[10vh] rounded-full bg-red-50"
                    />
                    <div className="flex flex-col ml-[3vh]">
                      <h1 className="font-bold">
                        {item.Product?.product_name}
                      </h1>
                      <h3 className="mt-[1vh]">x{item.Quantity}</h3>
                    </div>
                    <h2 className="ml-auto text-right">{`฿${item.Price * item.Quantity
                      }`}</h2>
                  </div>
                ))}
              </div>
              {/* Form section */}
              <Form
                name="basic"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="Type:"
                  name="ReturnTypeID"
                  className="mt-[3vh]"
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
                  label="Reason:"
                  name="ReturnReasonID"
                  rules={[{ required: true, message: "Please select reason!" }]}
                >
                  <Select
                    placeholder="Select reason"
                    options={reasons.map((reason) => ({
                      value: reason.ID,
                      label: reason.Name,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your description!",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Enter your description" />
                </Form.Item>

                <Form.Item
                  label="Proving Image"
                  name="ProvingImage"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your proving image!",
                    },
                  ]}
                >
                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    maxCount={1}
                    multiple={false}
                    listType="picture"
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
                <Alert
                  className="mb-[3vh]"
                  message='By clicking "Submit Request" you will get refund into your wallet when return status is "Success".'
                  type="info"
                  showIcon
                />
                {/* Submit Button Section */}
                <div className="flex gap-[1vh] ">
                  <button
                    type="submit"
                    className="bg-orange-600 p-[1vh] hover:bg-orange-700 text-white rounded-md"
                  >
                    Submit Request
                  </button>
                  <Link to="/orders">
                    <button className="bg-white text-orange-600 p-[1vh] ring-orange-600 ring-1 hover:bg-gray-100 rounded-md">
                      Cancel
                    </button>
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      {/* Preview modal */}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default CustomerReturnPage;
