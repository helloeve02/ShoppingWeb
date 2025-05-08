import { useEffect, useState } from "react";
import { Button, Divider, Dropdown, message, Modal } from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DashOutlined,
} from "@ant-design/icons";
import { ReturnInterface } from "../../interfaces/Return";
import {
  GetOrderItemsByUserID,
  GetReturnApproved,
  GetReturnRefunded,
  RefundReturn,
  UpdateWalletByUserID,
} from "../../services/https";
import Table, { ColumnsType } from "antd/es/table";
import { OrderitemInterface } from "../../interfaces/IOrder";
import { Link } from "react-router-dom";

const SellerReturnPage = () => {
  const userID = localStorage.getItem("id");
  const [messageApi, contextHolder] = message.useMessage();

  const [returnID, setReturnID] = useState("");

  const [returnApproved, setReturnApproved] = useState<ReturnInterface[]>([]);
  const [returnRefunded, setReturnRefunded] = useState<ReturnInterface[]>([]);
  const [orderItems, setOrderItems] = useState<OrderitemInterface[]>([]);

  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleRefund = async (
    returnID: string,
    userID: string,
    totalPrice: string
  ) => {
    const updateWalletForCustomer = await UpdateWalletByUserID(
      userID,
      totalPrice
    );
    if (updateWalletForCustomer.status === 200) {
      messageApi.success(updateWalletForCustomer.data.message);
      const refundedOrder = await RefundReturn(returnID);
      if (refundedOrder.status === 200) {
        messageApi.success(refundedOrder.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error(refundedOrder.data.error);
      }
    } else {
      message.error(updateWalletForCustomer.data.error);
    }
    message.open({
      type: "success",
      content: "This return request was refunded.",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getOrderItemsByUserID = async (id: string) => {
    try {
      const res = await GetOrderItemsByUserID(id);

      if (res.status === 200) {
        setOrderItems(res.data);
      } else {
        setOrderItems([]);
      }
    } catch (error) {
      setOrderItems([]);
      messageApi.error("Failed to fetch data");
    }
  };

  const ReturnApproved: ColumnsType<ReturnInterface> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "Proving Image",
      dataIndex: "ProvingImage",
      key: "ProvingImage",
      width: "10%",
      render: (text, record) => (
        <img
          src={record.ProvingImage}
          id={text}
          style={{ width: "100px", cursor: "pointer" }}
          onClick={() => {
            setPreviewImage(record.ProvingImage || ""); // Set the image for preview
            setPreviewTitle(`Proving Image - ${record.ID}`); // Set a meaningful title
            setPreviewVisible(true); // Show the modal
          }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Reason",
      key: "Reason",
      render: (record) => <>{record.ReturnReason?.Name || "N/A"}</>,
    },
    {
      title: "Type",
      key: "Type",
      render: (record) => <>{record.ReturnType?.Name || "N/A"}</>,
    },
    {
      title: "OrderID",
      dataIndex: "OrderID",
      key: "OrderID",
    },
    {
      title: "User",
      key: "User",
      render: (record) => <>{record.User?.UserName || "N/A"}</>,
    },
    {
      title: "Manage",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: "Refund",
                key: "1",
                icon: <CheckOutlined />,
                onClick: () => {
                  setApproveModalVisible(true);
                  getOrderItemsByUserID(record.User?.ID);
                  setReturnID(record.ID);
                },
              },
            ],
          }}
        >
          <Button
            type="primary"
            icon={<DashOutlined />}
            size={"small"}
            className="bg-orange-600 "
          />
        </Dropdown>
      ),
    },
  ];

  const ReturnRefunded: ColumnsType<ReturnInterface> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "Proving Image",
      dataIndex: "ProvingImage",
      key: "ProvingImage",
      width: "10%",
      render: (text, record) => (
        <img
          src={record.ProvingImage}
          id={text}
          style={{ width: "100px", cursor: "pointer" }}
          onClick={() => {
            setPreviewImage(record.ProvingImage || ""); // Set the image for preview
            setPreviewTitle(`Proving Image - ${record.ID}`); // Set a meaningful title
            setPreviewVisible(true); // Show the modal
          }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Reason",
      key: "Reason",
      render: (record) => <>{record.ReturnReason?.Name || "N/A"}</>,
    },
    {
      title: "Type",
      key: "Type",
      render: (record) => <>{record.ReturnType?.Name || "N/A"}</>,
    },
    {
      title: "OrderID",
      dataIndex: "OrderID",
      key: "OrderID",
    },
    {
      title: "User",
      key: "User",
      render: (record) => <>{record.User?.UserName || "N/A"}</>,
    },
    {
      title: "Status",
      key: "Status",
      render: (record) => <>{record.ReturnStatus?.Name || "N/A"}</>,
    },
  ];

  const getReturnApproved = async (id: string) => {
    try {
      const res = await GetReturnApproved(id);

      if (res.status === 200) {
        setReturnApproved(res.data);
      } else {
        setReturnApproved([]);
      }
    } catch (error) {
      setReturnApproved([]);
    }
  };

  const getReturnRefunded = async (id: string) => {
    try {
      const res = await GetReturnRefunded(id);

      if (res.status === 200) {
        setReturnRefunded(res.data);
      } else {
        setReturnRefunded([]);
      }
    } catch (error) {
      setReturnRefunded([]);
    }
  };

  useEffect(() => {
    getReturnApproved(userID || "");
    getReturnRefunded(userID || "");
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col max-w-7xl w-full mx-auto px-4 py-[3vh]">
        <Link to="/sellercenter">
          <button className="mb-[3vh] bg-white p-2 text-gray-400 ring-gray-400 ring-1 hover:bg-gray-100 rounded-md">
            <ArrowLeftOutlined /> Back to seller page
          </button>
        </Link>
        <h1 className="text-2xl font-bold">To Refund</h1>
        <div style={{ marginTop: 20 }}>
          <Table
            rowKey="ID"
            columns={ReturnApproved}
            dataSource={returnApproved}
            pagination={{ pageSize: 2 }}
            style={{ width: "100%", overflowX: "auto" }}
          />
        </div>
        <Divider />

        <h1 className="text-2xl font-bold">Refunded Return</h1>
        <div style={{ marginTop: 20 }}>
          <Table
            rowKey="ID"
            columns={ReturnRefunded}
            dataSource={returnRefunded}
            pagination={{ pageSize: 2 }}
            style={{ width: "100%", overflowX: "auto" }}
          />
        </div>

        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>

        {/* Approve Return Modal */}
        <Modal
          visible={approveModalVisible}
          title="Refund Return"
          onOk={() =>
            handleRefund(
              returnID,
              orderItems[0].UserID?.toString() || "",
              orderItems[0].Order?.TotalPrice?.toString() || ""
            )
          }
          onCancel={() => setApproveModalVisible(false)}
        >
          <p>Are you sure you want to refund this return request?</p>
        </Modal>
      </div>
    </>
  );
};

export default SellerReturnPage;
