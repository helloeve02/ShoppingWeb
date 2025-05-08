import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  message,
  Typography,
  Upload,
  Row,
  Col,
  Modal,
  Alert,
  Tooltip,
  Breadcrumb,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  DollarOutlined,
  TagOutlined,
  FileTextOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  CreateProduct,
  GetCategories,
  GetBrand,
  GetProductStatus,
} from "../../../services/https";
import { ProductInterface } from "../../../interfaces/Product";
import { BrandInterface } from "../../../interfaces/Brand";
import { CategoryInterface } from "../../../interfaces/Category";
import { ProductStatusInterface } from "../../../interfaces/ProductStatus";
import { useNavigate, Link } from "react-router-dom";
import { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Title } = Typography;

const CreateProducts: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [brands, setBrands] = useState<BrandInterface[]>([]);
  const [productStatuses, setProductStatuses] = useState<
    ProductStatusInterface[]
  >([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const userId = Number(localStorage.getItem("id"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData, productStatusData] =
          await Promise.all([GetCategories(), GetBrand(), GetProductStatus()]);
        setCategories(categoriesData.data);
        setBrands(brandsData.data);
        setProductStatuses(productStatusData.data);
      } catch (error) {
        message.error("Failed to load categories, brands, or product statuses");
      }
    };
    fetchData();
  }, []);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!file) {
        return reject("File is not defined");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject("Error reading file");
      reader.readAsDataURL(file);
    });

  const onFinish = async (values: any) => {
    if (fileList.length === 0) {
      message.warning("Please upload at least one product image");
      return;
    }
    setFormValues(values);
    setIsModalOpen(true);
  };

  const handleConfirmedSave = async () => {
    setLoading(true);

    if (fileList.length === 0) {
      message.warning("Please upload at least one product image.");
      setLoading(false);
      return;
    }
    try {
      const base64Images = await Promise.all(
        fileList.map((file) => convertToBase64(file.originFileObj as File))
      );

      const productData: ProductInterface = {
        product_name: formValues.product_name.trim(),
        category_id: Number(formValues.categoryID),
        brand_id: formValues.brandID ? Number(formValues.brandID) : 0,
        description: formValues.description.trim(),
        price: Number(formValues.price),
        stock: Number(formValues.stock),
        product_status_id: Number(formValues.product_status_id),
        user_id: userId,
        product_images: base64Images.map((base64) => ({ image: base64 })),
      };

      const response = await CreateProduct(productData);
      const productId = response?.product_id || response?.data?.product_id;

      if (!productId) {
        throw new Error("Product creation failed: Missing product ID");
      }

      message.success("Product created successfully!");
      form.resetFields();
      setFileList([]);
      navigate("/sellercenter");
    } catch (error) {
      console.error("Error saving product:", error);
      message.error("Error creating product. Please try again.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleFileChange = async ({ fileList }: { fileList: UploadFile[] }) => {
    if (fileList.length > 5) {
      message.error("You can only upload up to 5 images.");
      return;
    }

    for (const file of fileList) {
      if (file.size && file.size > 50 * 1024 * 1024) {
        message.error(`File ${file.name} is too large. Max size is 50 MB.`);
        return;
      }
    }

    setFileList(fileList);
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
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-lg">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/sellercenter">
              <HomeOutlined /> Seller Center
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create Product</Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <Title level={2} className="m-0">
              Add New Product
            </Title>
            <Typography.Text type="secondary">
              Fill in the product details below
            </Typography.Text>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
          className="space-y-6"
        >
          {/* Product Image Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <PictureOutlined className="text-lg mr-2" />
              <Title level={4} className="m-0">
                Product Images
              </Title>
            </div>
            <Alert
              message="Image Guidelines"
              description="Upload up to 5 high-quality images. First image will be the main product image. Maximum size: 50MB per image."
              type="info"
              showIcon
              className="mb-4"
            />
            <Form.Item
              name="product_images"
              rules={[
                { required: true, message: "Please upload at least one image" },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
                accept="image/*"
                maxCount={5}
              >
                {fileList.length < 5 && (
                  <div>
                    <PictureOutlined />
                    <div className="mt-2">Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          {/* Basic Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <FileTextOutlined className="text-lg mr-2" />
              <Title level={4} className="m-0">
                Basic Information
              </Title>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Product Name"
                  name="product_name"
                  rules={[
                    { required: true, message: "Please enter product name" },
                  ]}
                  tooltip="Choose a clear, descriptive name"
                >
                  <Input
                    placeholder="Enter product name"
                    maxLength={100}
                    showCount
                    suffix={
                      <Tooltip title="Choose a clear, descriptive name">
                        <InfoCircleOutlined
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryID"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select
                    placeholder="Select product category"
                    options={categories.map((cat) => ({
                      label: cat.category_name,
                      value: cat.ID,
                    }))}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Brand"
                  name="brandID"
                  tooltip="Optional - Select if product has a specific brand"
                >
                  <Select
                    placeholder="Select product brand"
                    options={brands.map((brand) => ({
                      label: brand.brand_name,
                      value: brand.ID,
                    }))}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter product description" },
              ]}
              tooltip="Provide detailed information about your product"
            >
              <TextArea
                placeholder="Enter product description"
                rows={4}
                maxLength={10000}
                showCount
              />
            </Form.Item>
          </div>

          {/* Price and Stock Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <DollarOutlined className="text-lg mr-2" />
              <Title level={4} className="m-0">
                Price and Stock
              </Title>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[
                    { required: true, message: "Please enter product price" },
                  ]}
                  tooltip="Set a competitive price"
                >
                  <InputNumber
                    min={1}
                    max={1000000}
                    step={0.25}
                    placeholder="Enter product price"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      value
                        ? `฿ ${value
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                        : ""
                    }
                    parser={(value) => {
                      if (!value) return 1;
                      const parsedValue = parseFloat(
                        value.replace(/[^0-9.]/g, "")
                      );
                      if (isNaN(parsedValue)) return 1;
                      if (parsedValue < 1) return 1;
                      if (parsedValue > 1000000) return 1000000;
                      return parsedValue as 1 | 1000000;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Stock"
                  name="stock"
                  rules={[
                    { required: true, message: "Please enter product stock" },
                  ]}
                  tooltip="Enter available quantity"
                >
                  <InputNumber
                    min={1}
                    max={1000000}
                    step={1}
                    placeholder="Enter product stock"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Product Status Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <TagOutlined className="text-lg mr-2" />
              <Title level={4} className="m-0">
                Product Status
              </Title>
            </div>
            <Form.Item
              label="Product Status"
              name="product_status_id"
              rules={[
                { required: true, message: "Please select product status" },
              ]}
              tooltip="Set the current status of your product"
            >
              <Select
                placeholder="Select product status"
                options={productStatuses.map((status) => ({
                  label: status.product_status_name,
                  value: status.ID,
                }))}
              />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-6 space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              size="middle" // smaller button size
              className="w-32" // specific width
            >
              Back
            </Button>
            <Button
              icon={<SaveOutlined />}
              htmlType="submit"
              type="primary"
              loading={loading}
              size="middle" // smaller button size
              className="w-32" // specific width
            >
              Confirm
            </Button>
          </div>
        </Form>

        <Modal
          title="Confirm Save"
          open={isModalOpen}
          onOk={handleConfirmedSave}
          onCancel={() => setIsModalOpen(false)}
          confirmLoading={loading}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Are you sure you want to save this product?</p>
          <p>Please confirm all the details are correct before proceeding.</p>
        </Modal>
      </Card>
    </div>
  );
};
export default CreateProducts;
