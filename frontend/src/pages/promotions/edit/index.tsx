import {
  Form,
  Input,
  InputNumber,
  Switch,
  DatePicker,
  Button,
  message,
  Modal,
  List,
  Checkbox,
  Tag,
  Alert,
  Select,
} from "antd";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ProductInterface } from "../../../interfaces/Product";
import {
  GetPromotionByID,
  GetProductByUserID,
  GetPromotionStatus,
  UpdatePromotion,
} from "../../../services/https";
import {
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const EditPromotions = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = Number(localStorage.getItem("id"));
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountType, setDiscountType] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [selectedProductNames, setSelectedProductNames] = useState<
    Map<string, string>
  >(new Map());
  const [promotionStatuses, setPromotionStatuses] = useState<any[]>([]); // Add state for promotion statuses

  // Fetch promotion statuses only once
  useEffect(() => {
    const fetchPromotionStatuses = async () => {
      try {
        const response = await GetPromotionStatus();
        if (response?.status === 200) {
          setPromotionStatuses(response.data);
        } else {
          messageApi.error("Failed to fetch promotion statuses");
        }
      } catch (error) {
        setError("Failed to fetch promotion statuses. Please try again later.");
        messageApi.error("Failed to fetch promotion statuses");
      }
    };

    fetchPromotionStatuses();
  }, [messageApi]); // Empty dependency array ensures it runs only once

  useEffect(() => {
    if (id) {
      const fetchPromotionData = async () => {
        try {
          setLoading(true);
          const promotionResponse = await GetPromotionByID(id);
          if (promotionResponse?.status === 200) {
            const promotionData = promotionResponse.data;
            form.setFieldsValue({
              promotion_name: promotionData.promotion_name,
              description: promotionData.description,
              discount_type: promotionData.discount_type,
              discount_value: promotionData.discount_value,
              usage_limit: promotionData.usage_limit,
              date_range: [
                dayjs(promotionData.start_date),
                dayjs(promotionData.end_date),
              ],
              promotion_status: promotionData.promotion_status_id, // Set the promotion status
            });
            setSelectedProducts(
              new Set(
                promotionData.products.map((prod: any) =>
                  prod.product_id.toString()
                )
              )
            );
            setSelectedProductNames(
              new Map(
                promotionData.products.map((prod: any) => [
                  prod.product_id.toString(),
                  prod.product_name,
                ])
              )
            );
            setDiscountType(promotionData.discount_type);
          } else {
            throw new Error("Failed to fetch promotion data");
          }
        } catch (error) {
          setError("Failed to fetch promotion data. Please try again later.");
          messageApi.error("Failed to fetch promotion data");
        } finally {
          setLoading(false);
        }
      };

      fetchPromotionData();
    }
  }, [id, form, messageApi]);

  const fetchProducts = async () => {
    try {
      const response = await GetProductByUserID(userId.toString());
      if (response?.status === 200) {
        setProducts(response.data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      setError("Failed to fetch products. Please try again later.");
      messageApi.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const onFinish = async (values: any) => {
    Modal.confirm({
      title: "Confirm Update",
      content: "Are you sure you want to update the promotion?",
      onOk: async () => {
        try {
          setSubmitLoading(true);

          const discountValue = Number(values.discount_value);
          const promotionData = {
            promotion_name: values.promotion_name,
            description: values.description,
            discount_type: discountType,
            discount_value: discountValue,
            start_date: values.date_range[0].toISOString(),
            end_date: values.date_range[1].toISOString(),
            usage_limit: values.usage_limit,
            user_id: userId,
            users: [{ user_id: userId }],
            products: Array.from(selectedProducts).map((productId: any) => ({
              product_id: Number(productId),
              discount_value: discountValue,
            })),
            promotion_status_id: values.promotion_status,
          };

          const response = await UpdatePromotion(id as string, promotionData);

          if (response?.status === 200) {
            messageApi.success("Promotion updated successfully!");
            form.resetFields();
            setSelectedProducts(new Set());
            navigate("/sellercenter"); // Navigate to sellercenter after success
          } else {
            throw new Error("Failed to update promotion");
          }
        } catch (error) {
          messageApi.error("Error updating promotion. Please try again.");
        } finally {
          setSubmitLoading(false);
        }
      },
      okText: "Yes, update",
      cancelText: "No, cancel",
    });
  };

  const onProductSelectChange = (
    productId: string,
    productName: string,
    checked: boolean
  ) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });

    setSelectedProductNames((prev) => {
      const next = new Map(prev);
      if (checked) {
        next.set(productId, productName);
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
    setSelectedProductNames((prev) => {
      const next = new Map(prev);
      next.delete(productId);
      return next;
    });
  };

  const handleDiscountTypeChange = (checked: boolean) => {
    setDiscountType(checked);
  };

  const handleBack = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: "Confirm Navigation",
        content:
          "Are you sure you want to leave? Any unsaved changes will be lost.",
        onOk: () => navigate("/sellercenter"),
        okText: "Yes, leave",
        cancelText: "No, stay",
      });
    } else {
      navigate("/sellercenter");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      {contextHolder}

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-6"
              closable
              onClose={() => setError(null)}
            />
          )}

          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Edit Promotion
            </h2>
            <p className="text-gray-600">Edit the details of your promotion</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                name="promotion_name"
                label="Promotion Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the promotion name",
                  },
                ]}
              >
                <Input
                  placeholder="Enter promotion name"
                  className="w-full rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter promotion description"
                  className="w-full rounded-lg"
                />
              </Form.Item>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Discount Settings
                </h3>
                <Form.Item name="discount_type" valuePropName="checked">
                  <Switch
                    checkedChildren="Percentage"
                    unCheckedChildren="Fixed"
                    onChange={handleDiscountTypeChange}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Form.Item
                  name="discount_value"
                  label="Discount Value"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a discount value",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={discountType ? 100 : 10000}
                    addonAfter={discountType ? "%" : "THB"}
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item
                  name="usage_limit"
                  label="Usage Limit"
                  rules={[
                    { required: true, message: "Please enter usage limit" },
                  ]}
                >
                  <InputNumber min={1} max={10000} className="w-full" />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="promotion_status"
              label="Promotion Status"
              rules={[
                { required: true, message: "Please select a promotion status" },
              ]}
            >
              <Select
                placeholder="Select promotion status"
                options={promotionStatuses.map((status) => ({
                  label: status.promotion_status_name,
                  value: status.ID,
                }))}
                className="w-full"
              />
            </Form.Item>

            {/* Selected Products Display */}
            <div className="space-y-4">
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="w-full md:w-auto"
              >
                Select Products ({selectedProducts.size})
              </Button>

              {selectedProducts.size > 0 && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex flex-wrap gap-3">
                    {Array.from(selectedProductNames.entries()).map(
                      ([id, name]) => (
                        <Tag
                          key={id}
                          closable
                          onClose={() => removeProduct(id)}
                          className="p-2"
                        >
                          {name}
                        </Tag>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <Form.Item
              name="date_range"
              label="Promotion Period"
              rules={[
                {
                  required: true,
                  message: "Please select the promotion period",
                },
              ]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                className="w-full"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <div className="flex justify-between items-center pt-6 space-x-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size="middle"
                className="w-32"
              >
                Back
              </Button>
              <Button
                icon={<SaveOutlined />}
                htmlType="submit"
                type="primary"
                loading={submitLoading}
                size="middle"
                className="w-32"
              >
                Confirm
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Product Selection Modal */}
      <Modal
        title="Select Products"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
        width={600}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search products..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="mb-4"
        />

        <List
          dataSource={filteredProducts}
          loading={loading}
          className="max-h-96 overflow-y-auto"
          pagination={{ pageSize: 10 }}
          renderItem={(product) => (
            <List.Item className="hover:bg-gray-50">
              <Checkbox
                checked={selectedProducts.has(product.ID?.toString() || "")}
                onChange={(e) =>
                  onProductSelectChange(
                    product.ID?.toString() || "",
                    product.product_name || "Unnamed Product",
                    e.target.checked
                  )
                }
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      product.product_images?.[0]?.image || "/placeholder.png"
                    }
                    alt={product.product_name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <div className="font-medium">{product.product_name}</div>
                    <div className="text-gray-500">{product.price} THB</div>
                  </div>
                </div>
              </Checkbox>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default EditPromotions;
