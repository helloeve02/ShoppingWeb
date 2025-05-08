import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  TagOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  GetProductByUserID,
  DeleteProduct,
  GetAllPromotion,
  DeletePromotion,
  GetProductStatus,
} from "../../services/https";
import {
  Input,
  Modal,
  Spin,
  Card,
  Statistic,
  Empty,
  Badge,
  Pagination,
  notification,
} from "antd";
import { ProductInterface } from "../../interfaces/Product";
import { PromotionInterface } from "../../interfaces/Promotion";

const SellerCenter = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [loadingPromotions, setLoadingPromotions] = useState<boolean>(false);
  const [productStatuses, setProductStatuses] = useState<{
    [key: string]: string;
  }>({});
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [promotionSearchTerm, setPromotionSearchTerm] = useState(""); // New state for promotions
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const getImageSrc = (image: string | undefined) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("/9j/")) {
      return `data:image/jpeg;base64,${image}`;
    } else if (image.startsWith("iVBORw0KGgo")) {
      return `data:image/png;base64,${image}`;
    }
    return image;
  };

  const showErrorNotification = (message: string) => {
    notification.error({
      message: "Error",
      description: message,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingProducts(true);
      setLoadingPromotions(true);

      try {
        const [productResponse, promotionResponse, statusResponse] =
          await Promise.all([
            GetProductByUserID(userId || ""),
            GetAllPromotion(),
            GetProductStatus(),
          ]);

        if (Array.isArray(productResponse.data)) {
          setProducts(productResponse.data);
        } else {
          throw new Error("Invalid response format for products.");
        }

        if (Array.isArray(promotionResponse.data)) {
          setPromotions(promotionResponse.data);
        } else {
          throw new Error("Invalid response format for promotions.");
        }

        const statusMapping = statusResponse.data.reduce(
          (
            acc: Record<string, string>,
            status: { ID: string; product_status_name: string }
          ) => {
            acc[status.ID] = status.product_status_name;
            return acc;
          },
          {}
        );

        setProductStatuses(statusMapping);
      } catch (error) {
        if (error instanceof Error) {
        }
      } finally {
        setLoadingProducts(false);
        setLoadingPromotions(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleDeleteProduct = (productID: string) => {
    Modal.confirm({
      title: "Delete Product",
      content:
        "Are you sure you want to delete this product? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await DeleteProduct(productID);
          setProducts((prev) =>
            prev.filter((product) => String(product.ID) !== productID)
          );
        } catch (error) {
          showErrorNotification("Failed to delete product.");
        }
      },
    });
  };

  const handleDeletePromotion = (promotionID: string) => {
    Modal.confirm({
      title: "Delete Promotion",
      content:
        "Are you sure you want to delete this promotion? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await DeletePromotion(promotionID);
          setPromotions((prev) =>
            prev.filter((promotion) => String(promotion.ID) !== promotionID)
          );
        } catch (error) {
          showErrorNotification("Failed to delete promotion.");
        }
      },
    });
  };

  const filteredProducts = products.filter((product) =>
    product.product_name
      ?.toLowerCase()
      .includes(productSearchTerm.toLowerCase())
  );

  const filteredPromotions = promotions.filter((promotion) =>
    promotion.promotion_name
      ?.toLowerCase()
      .includes(promotionSearchTerm.toLowerCase())
  );

  const handleProductPageChange = (page: number) => {
    setCurrentProductPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl fixed h-full">
        <div className="p-8">
          <div className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
            <span className="text-orange-500">Seller</span> Center
          </div>
          <nav className="space-y-4">
            <Link
              to="/products/create"
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-gray-700 transition-all duration-200 group"
            >
              <ShoppingOutlined className="text-2xl group-hover:scale-110 transition-transform" />
              <span className="font-medium">Products</span>
            </Link>
            <Link
              to="/promotions/create"
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-gray-700 transition-all duration-200 group"
            >
              <TagOutlined className="text-2xl group-hover:scale-110 transition-transform" />
              <span className="font-medium">Promotions</span>
            </Link>
            <Link
              to="/seller/return"
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-orange-50 hover:text-orange-600 text-gray-700 transition-all duration-200 group"
            >
              <UndoOutlined className="text-2xl group-hover:scale-110 transition-transform" />
              <span className="font-medium">Returns</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-orange-500">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Total Products
                  </span>
                }
                value={products.length}
                prefix={<ShoppingOutlined className="text-orange-500" />}
                className="text-2xl"
              />
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    Active Promotions
                  </span>
                }
                value={promotions.length}
                prefix={<TagOutlined className="text-blue-500" />}
                className="text-2xl"
              />
            </Card>
          </div>

          {/* Product Management */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              <div className="flex space-x-4">
                <Input
                  placeholder="Search products..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-72 rounded-lg"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => navigate("/products/create")}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  <PlusOutlined className="mr-2" />
                  Add Product
                </button>
              </div>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center py-16">
                <Spin size="large" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <Empty
                description="No products found"
                className="py-16"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts
                  .slice(
                    (currentProductPage - 1) * itemsPerPage,
                    currentProductPage * itemsPerPage
                  )
                  .map((product) => (
                    <Card
                      key={product.ID}
                      hoverable
                      className="relative transition-all duration-200 hover:shadow-xl rounded-xl overflow-hidden group"
                    >
                      <div className="relative">
                        <img
                          src={getImageSrc(product.product_images?.[0]?.image)}
                          alt={product.product_name}
                          className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <Badge.Ribbon
                          text={
                            productStatuses[
                            product.product_status_id?.toString() || ""
                            ] || "Unknown"
                          }
                          color="orange"
                          className="absolute top-4 right-4"
                        />
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Product Name */}
                        <h3 className="text-sm font-medium text-gray-800 overflow-hidden whitespace-nowrap text-ellipsis">
                          {product.product_name}
                        </h3>

                        {/* Price and Stock Information */}
                        <div className="flex justify-between items-center">
                          <p className="text-xl font-semibold text-orange-600">
                            ฿{(product.price ?? 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 mt-4">
                          <button
                            onClick={() =>
                              navigate(`/products/edit/${product.ID}`)
                            }
                            className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 
                   rounded-md hover:bg-orange-700 transition-all duration-300 transform 
                   hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 
                   focus:ring-opacity-50 text-sm"
                          >
                            <EditOutlined className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(String(product.ID))
                            }
                            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 
                   rounded-md hover:bg-red-600 transition-all duration-300 transform 
                   hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 
                   focus:ring-opacity-50 text-sm"
                          >
                            <DeleteOutlined className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}

            <Pagination
              current={currentProductPage}
              total={filteredProducts.length}
              pageSize={itemsPerPage}
              onChange={handleProductPageChange}
              disabled={filteredProducts.length === 0}
              className="mt-8 flex justify-center"
            />
          </div>

          {/* Promotions Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Active Promotions
              </h2>
              <div className="flex space-x-4">
                <Input
                  placeholder="Search promotions..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-72 rounded-lg"
                  value={promotionSearchTerm} // Bind to promotionSearchTerm
                  onChange={(e) => setPromotionSearchTerm(e.target.value)} // Update state
                />
                <button
                  onClick={() => navigate("/promotions/create")}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  <PlusOutlined className="mr-2" />
                  Add Promotion
                </button>
              </div>
            </div>

            {loadingPromotions ? (
              <div className="flex justify-center py-16">
                <Spin size="large" />
              </div>
            ) : filteredPromotions.length === 0 ? (
              <Empty
                description="No promotions found"
                className="py-16"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPromotions.map((promotion) => (
                  <Card
                    key={promotion.ID}
                    className="transition-all duration-200 hover:shadow-xl rounded-xl overflow-hidden group"
                  >
                    <div className="p-4 space-y-4">
                      {/* Promotion Name */}
                      <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                        {promotion.promotion_name}
                      </h3>

                      {/* Promotion Date */}
                      <div className="text-sm text-gray-500">
                        <p>
                          Start:{" "}
                          {new Date(
                            promotion.start_date || ""
                          ).toLocaleDateString("th-TH")}
                        </p>
                        <p>
                          End:{" "}
                          {new Date(
                            promotion.end_date || ""
                          ).toLocaleDateString("th-TH")}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 mt-4">
                        <button
                          onClick={() =>
                            navigate(`/promotions/edit/${promotion.ID}`)
                          }
                          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 
                                   rounded-md hover:bg-orange-700 transition-all duration-300 transform 
                                   hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 
                                   focus:ring-opacity-50 text-sm"
                        >
                          <EditOutlined className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            handleDeletePromotion(String(promotion.ID))
                          }
                          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 
                                   rounded-md hover:bg-red-600 transition-all duration-300 transform 
                                   hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 
                                   focus:ring-opacity-50 text-sm"
                        >
                          <DeleteOutlined className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCenter;
