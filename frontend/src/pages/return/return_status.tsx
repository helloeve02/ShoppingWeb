import { useEffect, useState } from "react";
import { Alert, message, Modal } from "antd";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import logo from "../../assets/shoppoicon.png";
import promo from "../../assets/promo.jpg";
import { Link, useLocation } from "react-router-dom";
import { GetShopNameByUserID } from "../../services/https";

const ReturnStatusPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const location = useLocation();
  const { orderItem } = location.state || {};
  const [shopName, setShopName] = useState("");

  // onPreview updated to directly handle URL passed as argument
  const onPreview = (imageUrl: string, imageName?: string) => {
    setPreviewImage(imageUrl);
    setPreviewTitle(imageName || "Proving Image");
    setPreviewVisible(true);
  };

  // Get image URL for product image
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

  const getShopNameByUserID = async (id: string) => {
    try {
      const res = await GetShopNameByUserID(id);
      if (res.status === 200) {
        setShopName(res.data);
      }
    } catch (error) {
      messageApi.error("Failed to fetch shop name");
      setShopName("");
    }
  };

  // Handle clicking image and show preview
  const handleImageClick = (imageUrl: string) => {
    onPreview(imageUrl); // Passing image URL to onPreview function
  };

  useEffect(() => {
    getShopNameByUserID(orderItem[0].Product?.user_id);
  }, []);

  return (
    <>
      {contextHolder}
      {/* {contextHolder} */}
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="flex w-full min-h-[10vh] items-center border-b bg-white">
          <div className="flex flex-row divide-x divide-orange-600 items-center max-w-7xl w-full mx-auto px-4">
            <div className="flex flex-row gap-1 items-center text-orange-600 text-[3vh] sm:text-[4vh] font-bold ">
              <img src={logo} className="object-cover h-[5vh] sm:h-[7vh]" />
              <h1>RETURN STATUS</h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col max-w-7xl w-full mx-auto px-4 py-[3vh]">
          <Link to="/orders">
            <button className="mb-[3vh] bg-white p-2 text-gray-400 ring-gray-400 ring-1 hover:bg-gray-100 rounded-md">
              <ArrowLeftOutlined /> Back to order page
            </button>
          </Link>

          {/* Iterate over the returned order item */}
          <div className="bg-white h-auto w-full mx-auto flex flex-col px-[5vh] py-[3vh] rounded-lg shadow-lg">
            <div className="divide-y divide-gray-200">
              {/* Shop Section */}
              <div className="flex flex-row items-center gap-[1vh] mb-[1vh]">
                <div className="flex flex-row items-center gap-[1vh]">
                  <strong>{shopName}</strong>
                </div>
                <div className="flex text-right ml-auto">
                  <p className="font-bold mr-1">Status:</p>
                  {orderItem[0].Order.Return[0].ReturnStatus?.Name}
                </div>
              </div>

              {/* Item Section */}
              {orderItem?.map((item: any) => (
                <div
                  key={item.ID}
                  className="flex flex-row py-[2vh] px-[3vh] items-center"
                >
                  <img
                    src={getImageUrl(
                      item.Product?.product_images?.[0]?.image || ""
                    )}
                    className="object-cover h-[10vh] w-[10vh] rounded-full bg-red-50"
                  />
                  <div className="flex flex-col ml-[3vh]">
                    <h1 className="font-bold">{item.Product?.product_name}</h1>
                    <h3 className="mt-[1vh]">x{item.Quantity}</h3>
                  </div>
                  <h2 className="ml-auto text-right">{`฿${item.Price * item.Quantity
                    }`}</h2>
                </div>
              ))}

              {/* Return Data */}
              <div className="flex flex-col gap-[1vh] pt-[3vh]">
                <div className="flex">
                  <p className="font-bold mr-1">Type:</p>
                  {orderItem[0].Order.Return[0].ReturnType?.Name}
                </div>
                <div className="flex">
                  <p className="font-bold mr-1">Reason:</p>
                  {orderItem[0].Order.Return[0].ReturnReason.Name}
                </div>
                <div className="flex">
                  <p className="font-bold mr-1">Description:</p>
                  {orderItem[0].Order.Return[0].Description}
                </div>
                <div className="flex items-center">
                  <p className="font-bold mr-1">Proving Image:</p>
                  <button
                    className="ring-gray-400 text-gray-400 ring-1 hover:bg-gray-100 p-1 rounded-md"
                    onClick={() =>
                      handleImageClick(
                        orderItem[0].Order.Return[0].ProvingImage
                      )
                    }
                  >
                    <EyeOutlined /> Click to view proving image
                  </button>
                </div>
                <Alert
                  message="You will get refund to wallet when return status is success."
                  type="info"
                  showIcon
                />
                <Alert
                  message="If return status is denied it means you cannot get refund by some reason."
                  type="warning"
                  showIcon
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal for images */}
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

export default ReturnStatusPage;
