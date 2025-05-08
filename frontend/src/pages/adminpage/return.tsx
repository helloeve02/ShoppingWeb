import { useEffect, useState } from "react";
import { Button, Divider, Dropdown, message, Modal } from "antd";
import { CheckOutlined, CloseOutlined, DashOutlined } from "@ant-design/icons";
import { ReturnInterface } from "../../interfaces/Return";
import {
  ApproveReturn,
  DenyReturn,
  GetReturnManaged,
  GetReturnRequest,
} from "../../services/https";
import Table, { ColumnsType } from "antd/es/table";

const AdminReturn = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [returnRequest, setReturnRequest] = useState<ReturnInterface[]>([]);
  const [returnManaged, setReturnManaged] = useState<ReturnInterface[]>([]);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const ReturnRequest: ColumnsType<ReturnInterface> = [
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
                label: "Approve",
                key: "1",
                icon: <CheckOutlined />,
                onClick: () => {
                  ApproveReturn(record.ID);
                  message.open({
                    type: "success",
                    content: "This return request was approved.",
                  });
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000)
                },
              },
              {
                label: "Deny",
                key: "2",
                icon: <CloseOutlined />,
                onClick: () => {
                  DenyReturn(record.ID);
                  message.open({
                    type: "success",
                    content: "This return request was denied.",
                  });
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000)
                },
                danger: true,
              },
            ],
          }}
        >
          <Button
            type="primary"
            icon={<DashOutlined />}
            size={"small"}
            className="btn"
          />
        </Dropdown>
      ),
    },
  ];

  const ReturnManaged: ColumnsType<ReturnInterface> = [
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

  const getReturnRequest = async () => {
    try {
      const res = await GetReturnRequest();

      if (res.status === 200) {
        setReturnRequest(res.data);
      } else {
        setReturnRequest([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      setReturnRequest([]);
      messageApi.error("Failed to fetch data!");
    }
  };

  const getReturnManaged = async () => {
    try {
      const res = await GetReturnManaged();

      if (res.status === 200) {
        setReturnManaged(res.data);
      } else {
        setReturnManaged([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      setReturnManaged([]);
      messageApi.error("Failed to fetch data!");
    }
  };

  useEffect(() => {
    getReturnRequest();
    getReturnManaged();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col bg-gray-100">
        <h1 className="text-2xl font-bold">Return Request</h1>
        <div style={{ marginTop: 20 }}>
          <Table
            rowKey="ID"
            columns={ReturnRequest}
            dataSource={returnRequest}
            pagination={{ pageSize: 2 }}
            style={{ width: "100%", overflowX: "auto" }}
          />
        </div>
        <Divider />
        <h1 className="text-2xl font-bold">Return Managed</h1>
        <div style={{ marginTop: 20 }}>
          <Table
            rowKey="ID"
            columns={ReturnManaged}
            dataSource={returnManaged}
            pagination={{ pageSize: 3 }}
            style={{ width: "100%", overflowX: "auto" }}
          />
        </div>
        <Divider />

        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </>
  );
};

export default AdminReturn;