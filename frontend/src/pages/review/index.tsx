import { Button, Form, GetProp, Input, Menu, message, Modal, Rate, Upload, UploadFile, UploadProps } from 'antd';
import { ShoppingCartOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { CreateReview, FavoriteToggle, ListUserReviews } from '../../services/https';
import { ReviewInterface, OrderitemInterface } from '../../interfaces/IReview';
import 'antd/dist/reset.css';
import './index.css';
import { useLocation, useNavigate } from 'react-router-dom';

interface ReviewPageProps {
  orderItems?: any[];
  onClose?: () => void;

}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const userId = Number(localStorage.getItem("id")) as number;


const ReviewPage: React.FC<ReviewPageProps> = () => {
  const [currentPage, setCurrentPage] = useState('noReview');
  const [selectedProduct, setSelectedProduct] = useState<ReviewInterface | null>(null);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewedProducts, setReviewedProducts] = useState<ReviewInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi] = message.useMessage();
  const [orderItemsID, setOrderItemsID] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const orderItems = location.state?.orderItems || [];
  const imageUrl = fileList[0]?.thumbUrl || null;

  useEffect(() => {
    if (!location.state?.orderItems) {
      message.error("Order items not found. Redirecting to orders page...");
      navigate("/orders");
    }
  }, [location, navigate]);


  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const userReviewsResponse = await ListUserReviews(userId.toString());
      if (userReviewsResponse?.data) {
        setReviewedProducts(userReviewsResponse.data);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleReviewSubmit = async () => {
    if (!newReview || rating === 0) {
      message.error('Please write a review and select a rating.');
      return;
    }

    if (!orderItemsID) {
      message.error("Order item ID not found");
      return;
    }

    if (!location.state?.orderItems) {
      message.error("No order items found");
      navigate("/orders");
      return;
    }

    const image = fileList[0]?.thumbUrl || null;

    const formattedValues = {
      content: newReview,
      rating: rating,
      user_id: Number(userId),
      image: image === null ? fileList[0].url : image,
      orderitems_id: orderItemsID,
      Product: selectedProduct?.Product,
      create_date: new Date().toISOString()
    };


    try {
      setIsLoading(true);
      await CreateReview(formattedValues);

      setReviewedProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter((p) => p.ID !== orderItemsID);
        return [
          {
            ...selectedProduct,
            content: newReview,
            rating,
            product_images: [{ image: image === null ? fileList[0].url : image }],
            CreatedAt: new Date().toISOString(),
            Favorites: { count: 0 },
          },
          ...updatedProducts,
        ];
      });

      setCurrentPage('noReview');
      setNewReview('');
      setRating(0);
      setFileList([]);
      message.success('Review submitted successfully!');

      setSelectedProduct(null);
      fetchProducts();

    } catch (error) {
      messageApi.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isProductReviewed = (productId: number): boolean => {
    return reviewedProducts.some((review) => review.product_id === productId);
  };

  const onFinishFailed = () => {
    message.error("Review submitted failed!");
  };

  const handleProductClick = (product: OrderitemInterface) => {
    setSelectedProduct(product);
    setOrderItemsID(product.ID || null);

    const existingReview = reviewedProducts.find(
      (review) => review.product_id === product.ID
    );

    if (existingReview) {
      setNewReview(existingReview.content || "");
      setRating(existingReview.rating || 0);
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: existingReview.image,
        },
      ])
    } else {
      setNewReview("");
      setRating(0);
      setFileList([]);
    }
  };

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

  const menuItems = [
    {
      label: 'Products to Review',
      key: 'noReview',
      icon: <ShoppingCartOutlined />,
    },
    {
      label: 'My Reviews',
      key: 'reviewed',
      icon: <ShoppingCartOutlined />,
    },
  ];

  const handleFavoriteToggle = async (productId: number, reviewId: number, userId: number) => {
    try {

      const productIndex = reviewedProducts.findIndex((product) => product.product_id === productId);
      if (productIndex === -1) {
        return;
      }

      const product = reviewedProducts[productIndex];
      const isFavorited = (product.favorites_count ?? 0) > 0;
      const action = isFavorited ? "unfavorite" : "favorite";

      setReviewedProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.product_id === productId
            ? {
              ...p,
              favorites_count: (p.favorites_count ?? 0) + (isFavorited ? -1 : 1),
            }
            : p
        )
      );

      const response = await FavoriteToggle(productId, reviewId, userId, action);

      if (!response?.success) {
        setReviewedProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.product_id === productId
              ? {
                ...p,
                favorites_count: (p.favorites_count ?? 0) + (isFavorited ? -1 : 1),
              }
              : p
          )
        );

        message.error("Failed to toggle favorite.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };


  const handleClick = (product: ReviewInterface) => {
    const { product_id: productId, ID: reviewId } = product;
    if (productId !== undefined && reviewId !== undefined) {
      handleFavoriteToggle(productId, reviewId, userId);
    }
  };

  const renderContent = () => {
    if (currentPage === 'noReview') {
      return (
        <div>
          {orderItems.length > 0 ? (
            <div className="space-y-4">
              {orderItems.map((item: OrderitemInterface) => (
                <div
                  key={item.ID}
                  className="bg-white border border-gray-300 rounded-lg shadow-md p-4 relative"
                >
                  {/* Status Label */}
                  <div className="absolute top-4 right-4 text-orange-600 text-x font-medium px-3 py-1 rounded-full">
                    {item.Order?.Orderstatus?.Status}
                  </div>

                  {/* Shop Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        Preferred+
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {item.Product?.User?.UserName}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4">

                    {/* Product Details */}
                    <div className="flex space-x-4 mb-4">
                      <img
                        src={item.Product?.product_images?.[0]?.image || ""}
                        alt={item.Product?.product_images?.[0]?.image || "Product Image"}
                        className="w-20 h-20 object-contain rounded-md border"
                      />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-800">
                          {item.Product?.product_name}
                        </h3>
                        <p className="text-sm text-gray-500">x{item.Quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          ฿{item.TotalPrice || "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="border-t pt-4">
                    <div className="justify-between mb-2">
                    </div>
                    <div className="flex space-x-2 ">
                      <button
                        className="bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleProductClick(item)}>
                        {isProductReviewed(item?.ID ?? 0) ? 'Edit Reveiw' : 'Rate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products to review.</p>
          )}
        </div>
      );
    }
    if (currentPage === 'reviewed') {
      return (
        <div className="space-y-6">
          {reviewedProducts.length > 0 ? (
            <ul className="space-y-4">
              {reviewedProducts.map((product) => (
                <li
                  key={product.ID}
                  className="bg-white shadow p-4 rounded-lg border flex flex-col space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        {product.User?.UserName || "Anonymous"}
                      </h3>
                      <div className="text-yellow-400 flex space-x-1">
                        {Array(5)
                          .fill(null)
                          .map((_, index) => (
                            <span
                              key={index}
                              className={`${index < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            >
                              ★
                            </span>
                          ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {product.UpdatedAt ? new Date(product.UpdatedAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "Unknown Date"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="font-small text-gray-800 bg-white-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-4">
                      {product.OrderItems?.Product?.product_images && product.OrderItems.Product.product_images.length > 0 ? (
                        <img
                          src={product.OrderItems.Product.product_images[0]?.image || "/default-image.jpg"}
                          alt="Review Image"
                          className="w-16 h-16 rounded-lg object-contain"
                        />
                      ) : (
                        <img
                          src="/default-image.jpg"
                          alt="No image available"
                          className="w-16 h-16 rounded-lg object-contain"
                        />
                      )}

                      <div className="flex-1">
                        <p className="font-medium">{product.OrderItems?.Product?.product_name || "No Product Name"}</p>
                        <p className="text-sm text-gray-500">Amount: {product.OrderItems?.Quantity || "Default"}</p>
                      </div>

                      <p className="text-sm text-orange-500 ml-auto">
                        ฿{product.OrderItems?.TotalPrice || "0.00"}
                      </p>
                    </div>

                    <p className="text-gray-800 mt-3">{product.content}</p>
                    <div className="flex space-x-2 mt-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt="Review Image"
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">

                    <button
                      onClick={() => handleClick(product)}
                      className={`heart-button ${product.favorites_count && product.favorites_count > 0 ? "favorited" : ""}`}
                    >
                      <span className="mr-1">{product.favorites_count ?? 0}</span>
                      {product.favorites_count && product.favorites_count > 0 ? '❤️' : '🤍'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reviewed products yet.</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-screen-xl mx-auto">
        <Menu
          className="my-custom-menu"
          onClick={(e) => setCurrentPage(e.key)}
          selectedKeys={[currentPage]}
          mode="horizontal"
          items={menuItems}
        />

        {/* Render content */}
        <div className="mt-6">{renderContent()}</div>

        {/* Review Modal */}
        {selectedProduct && (
          <Modal
            visible={true}
            onCancel={() => setSelectedProduct(null)}
            footer={null}
            title={"Rate Product"}
            width={600}
            destroyOnClose
          >
            {orderItems.filter((item: OrderitemInterface) => item.ID === selectedProduct.ID).map((item: OrderitemInterface) => (
              <div className="font-small text-gray-800 bg-white-100 border border-gray-300 rounded-lg px-4 py-2 flex items-center space-x-4">
                {item.Product?.product_images && item.Product.product_images.length > 0 ? (
                  <img
                    src={item.Product.product_images[0]?.image || "/default-image.jpg"}
                    alt="Review Image"
                    className="w-16 h-16 rounded-lg object-contain"
                  />
                ) : (
                  <img
                    src="/default-image.jpg"
                    alt="No image available"
                    className="w-16 h-16 rounded-lg object-contain"
                  />
                )}

                <div className="flex-1">
                  <p className="font-medium">{item.Product?.product_name || "No Product Name"}</p>
                  <p className="text-sm text-gray-500">Amount: {item.Quantity || "Default"}</p>
                </div>

                <p className="text-sm text-orange-500 ml-auto">
                  ฿{item.TotalPrice || "0.00"}
                </p>
              </div>
            )
            )
            }
            <Form
              name="reviewForm"
              onFinish={handleReviewSubmit}
              onFinishFailed={onFinishFailed}
              initialValues={{
                rating: rating, review: newReview,
                uploadFile: fileList.length > 0 && fileList[0]?.url
                  ? fileList[0].url
                  : imageUrl,
              }}
            >
              {/* Review Textarea */}
              <Form.Item
                label="Write about this aspect"
                name="review"
                className="mt-5"
                rules={[{ required: true, message: "Please write a review!" }]}
              >
                <Input.TextArea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </Form.Item>

              {/* Rating Section */}
              <Form.Item
                name="rating"
                label="Product Quality"
                rules={[{ required: true, message: "Please select a rating!" }]}
              >
                <Rate
                  id={"rating"}
                  value={rating}
                  onChange={(value) => {
                    setRating(value);
                  }}

                />
              </Form.Item>

              {/* Upload Section */}
              <Form.Item
                label="Add Photo"
                name="uploadFile"
                rules={[{ required: true, message: "Please upload a photo!" }]}
              >
                <div>
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
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </div>
              </Form.Item>
              {/* Submit Button */}
              <Form.Item className="text-right">
                <Button
                  className="orange-button"
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={isLoading}

                >
                  Submit Review
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default ReviewPage;