import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
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
  GetCategories,
  GetBrand,
  GetProductByID,
  GetProductStatus,
  UpdateProduct,
} from "../../../services/https";
import { BrandInterface } from "../../../interfaces/Brand";
import { CategoryInterface } from "../../../interfaces/Category";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UploadFile } from "antd/es/upload/interface";
import { ProductStatusInterface } from "../../../interfaces/ProductStatus";

const { TextArea } = Input;
const { Title } = Typography;

const UpdateProducts: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [brands, setBrands] = useState<BrandInterface[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [productStatuses, setProductStatuses] = useState<
    ProductStatusInterface[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalValues, setOriginalValues] = useState<any>(null);
  const userId = Number(localStorage.getItem("id"));

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        message.error("Product ID is not defined.");
        return;
      }

      setLoading(true);

      try {
        const [productData, categoriesData, brandsData, productStatuses] =
          await Promise.all([
            GetProductByID(id),
            GetCategories(),
            GetBrand(),
            GetProductStatus(),
          ]);

        const product = productData.data;
        setProductStatuses(productStatuses.data);
        setCategories(categoriesData.data);
        setBrands(brandsData.data);

        const formValues = {
          product_name: product.product_name,
          categoryID: product.category_id,
          brandID: product.brand_id,
          description: product.description,
          price: product.price,
          stock: product.stock,
          status: product.product_status_id,
        };

        setOriginalValues(formValues);
        form.setFieldsValue(formValues);

        const imageFiles =
          product.product_images?.map((img: { image: string }) => ({
            uid: img.image,
            name: img.image.split("/").pop() || "unknown_image",
            url: img.image,
            status: "done",
          })) || [];

        setFileList(imageFiles);
      } catch (error) {
        message.error("Failed to fetch product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result?.toString() || "";
        const base64String = result.startsWith("data:image")
          ? result.split(",")[1]
          : result;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const convertFilesToBase64 = async (files: UploadFile[]) => {
    return Promise.all(
      files.map(async (file) => {
        if (file.originFileObj) {
          const base64 = await convertToBase64(file.originFileObj);
          return base64;
        }
        if (file.url) {
          return file.url.startsWith("data:image")
            ? file.url.split(",")[1]
            : file.url;
        }
        throw new Error("Invalid file.");
      })
    );
  };

  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    const validFiles = newFileList.filter((file) => {
      if (file.originFileObj && file.originFileObj.size > 5 * 1024 * 1024) {
        message.error(
          `${file.name} is too large. Please upload files under 5MB.`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length > 5) {
      message.error("You can only upload up to 5 images.");
      return;
    }

    setFileList(validFiles);
  };

  const handleBack = () => {
    const currentValues = form.getFieldsValue();
    const hasChanges =
      JSON.stringify(currentValues) !== JSON.stringify(originalValues);

    if (hasChanges) {
      Modal.confirm({
        title: "Unsaved Changes",
        content: "You have unsaved changes. Are you sure you want to leave?",
        okText: "Leave",
        cancelText: "Stay",
        onOk: () => navigate("/sellercenter"),
      });
    } else {
      navigate("/sellercenter");
    }
  };

  const onFinish = async () => {
    setIsModalOpen(true);
  };

  const handleConfirmedUpdate = async () => {
    if (!id) {
      message.error("Product ID is not defined.");
      return;
    }

    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const base64Images = await convertFilesToBase64(fileList);

      const productData = {
        ID: Number(id),
        product_name: values.product_name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        brand_id: values.brandID ? Number(values.brandID) : undefined,
        product_status_id: Number(values.status),
        user_id: userId,
        category_id: Number(values.categoryID),
        product_images: base64Images.map((img) => ({ image: img })),
      };

      const response = await UpdateProduct(id, productData);
      if (response?.error) {
        throw new Error(response.error);
      }

      message.success("Product updated successfully!");
      navigate("/sellercenter");
    } catch (error) {
      console.error("Update failed:", error);
      message.error(
        `Failed to update product: ${error instanceof Error ? error.message : "Unknown error occurred."
        }`
      );
    } finally {
      setLoading(false);
      setIsModalOpen(false);
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
          <Breadcrumb.Item>Edit Product</Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <Title level={2} className="m-0">
              Edit Product
            </Title>
            <Typography.Text type="secondary">
              Update your product information below
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
              description="Upload up to 5 high-quality images. Maximum size: 5MB per image."
              type="info"
              showIcon
              className="mb-4"
            />
            <Form.Item label="Upload Product Image" name="product_images">
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
                        ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                    }
                    parser={(value) => {
                      if (
                        !value ||
                        parseFloat(value.replace(/\$\s?|(,*)/g, "")) < 1
                      ) {
                        return 1 as 1;
                      }
                      if (
                        parseFloat(value.replace(/\$\s?|(,*)/g, "")) > 1000000
                      ) {
                        return 1000000 as 1000000;
                      }
                      return parseFloat(value.replace(/\$\s?|(,*)/g, "")) as
                        | 1
                        | 1000000;
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

          {/* Status Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <TagOutlined className="text-lg mr-2" />
              <Title level={4} className="m-0">
                Product Status
              </Title>
            </div>
            <Form.Item
              label="Product Status"
              name="status"
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
          <div className="flex justify-between items-center pt-6 space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-32 py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              <ArrowLeftOutlined className="mr-2" />
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center w-32 py-2 px-4 text-sm font-medium text-white bg-orange-500 border border-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <SaveOutlined className="mr-2" />
              Confirm
            </button>
          </div>
        </Form>

        <Modal
          title="Confirm Save"
          open={isModalOpen}
          onOk={handleConfirmedUpdate}
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
export default UpdateProducts;
