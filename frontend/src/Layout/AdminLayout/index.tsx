import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  BankOutlined,
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  WalletOutlined,
  LogoutOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./index.css";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // ฟังก์ชัน logout
  const logout = () => {
    // localStorage.removeItem("isLogin"); 
    // localStorage.removeItem("role"); 
    navigate("/");
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="80"
        collapsed={collapsed}
        onCollapse={toggleSidebar}
        className="bg-orange-800"
      >
        <div className="text-white text-center py-4 text-lg font-bold">
          Admin Menu
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<UndoOutlined />} className="text-white">
            <Link to="/return">Return</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<WalletOutlined />} className="text-white">
            <Link to="/payments">Payment</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<BankOutlined />} className="text-white">
            <Link to="/article">Help Center</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<InboxOutlined />} className="text-white">
            <Link to="/mailboxes">Mailbox</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="flex justify-between items-center bg-orange-800 px-4 text-white">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            className="text-white"
          />
          <div className="text-xl font-bold">Admin Dashboard</div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
            className="text-white"
          >
            Logout
          </Button>
        </Header>
        <Content className="p-4 bg-gray-100">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
