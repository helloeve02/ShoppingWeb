import {
  ShoppingCartOutlined,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  HistoryOutlined,
  WalletOutlined,
  SearchOutlined,
  HomeOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Drawer,
  Divider,
  Avatar,
  Menu,
  Popover,
  message,
  Spin,
  Input,
} from "antd";
import {
  GetUserById,
  GetCartById,
  GetAllPromotion,
} from "../../services/https";
import ig from "../../assets/ig.jpg";
import scb from "../../assets/scb.png";
import tw from "../../assets/twitter.jpg";
import fb from "../../assets/facebook.jpg";
import paypal from "../../assets/paypal.png";
import shoppo from "../../assets/shoppo.png";
import krungthai from "../../assets/krungthai.png";
import React, { useState, useEffect } from "react";
import green_bank from "../../assets/green_bank.jpg";
import { UsersInterface } from "../../interfaces/IUser";
import { CartitemInterface } from "../../interfaces/IOrder";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { PromotionInterface } from "../../interfaces/Promotion";
import promo from "../../assets/promo.jpg";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const userId = localStorage.getItem("id") || "0";
  const [user, setUser] = useState<UsersInterface | null>(null);
  const [orderItems, setOrderItems] = useState<CartitemInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      try {
        const [userData, cartResponse, promotionResponse] = await Promise.all([
          GetUserById(String(userId)),
          GetCartById(String(userId)),
          GetAllPromotion(),
        ]);

        setUser(userData.data);

        if (Array.isArray(cartResponse.data)) {
          setOrderItems(cartResponse.data);
        } else {
          setOrderItems([]);
        }

        if (Array.isArray(promotionResponse.data)) {
          setPromotions(promotionResponse.data);
        } else {
          setPromotions([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && userId !== "0") {
      fetchUserAndOrders();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successful");
    setTimeout(() => navigate("/"), 1000);
  };

  const renderCartItems = () => {
    if (orderItems.length === 0) {
      return <div className="p-4 text-center">Your cart is empty.</div>;
    }

    return orderItems.map((item) => {
      const product = item.Product;
      const productImage =
        product?.product_images && product.product_images.length > 0
          ? product.product_images[0].image
          : "https://via.placeholder.com/150";
      const productName = product?.product_name || "Product Name Not Available";
      const productPrice = product?.price || "N/A";

      return (
        <div key={item.ID} className="flex items-center p-4 border-b">
          <img
            src={productImage}
            alt={productName}
            className="w-12 h-12 object-cover"
          />
          <div className="ml-4 flex-grow">
            <div className="font-medium">{productName}</div>
            <div className="text-sm text-gray-500">
              {item.Quantity} x ${productPrice}
            </div>
          </div>
        </div>
      );
    });
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`); // Navigates to the search page
      setSearchQuery(""); // Optionally clear the search query after navigating
      isMobile && setMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  const UserMenu = () => (
    <Popover
      content={
        user ? (
          <div className="w-64">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar
                  size={40}
                  src={promo}
                  icon={<UserOutlined style={{ color: "black" }} />}
                />
                <div>
                  <div className="font-medium text-black">
                    {user.UserName || "Default Name"}
                  </div>
                  <div className="text-sm text-black">{user.Email}</div>
                </div>
              </div>
            </div>
            <Menu className="text-black">
              {[
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: "Profile",
                  onClick: () => navigate(`/profile/${userId}`),
                },
                {
                  key: "orders",
                  icon: <HistoryOutlined />,
                  label: "Orders",
                  onClick: () => navigate("/orders"),
                },
                {
                  key: "wallet",
                  icon: <WalletOutlined />,
                  label: "Wallet",
                  onClick: () => navigate(`/wallet/${userId}`),
                },
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  onClick: handleLogout,
                },
              ].map((item) =>
                item.type === "divider" ? (
                  <Menu.Divider key="divider" />
                ) : (
                  <Menu.Item key={item.key} onClick={item.onClick}>
                    {item.icon &&
                      React.cloneElement(item.icon, {
                        style: { color: "black" },
                      })}
                    <span className="text-black">{item.label}</span>
                  </Menu.Item>
                )
              )}
            </Menu>
          </div>
        ) : null
      }
      trigger="click"
      placement="bottomRight"
    >
      <Button
        type="text"
        className="flex items-center text-black hover:text-black"
      >
        <Avatar
          size="small"
          icon={<UserOutlined style={{ color: "black" }} />}
        />
      </Button>
    </Popover>
  );

  const MobileHeader: React.FC = () => (
    <div className="md:hidden bg-gradient-to-r from-orange-600 to-orange-700 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4">
        <Link to="/home" className="flex-shrink-0">
          <img src={shoppo} alt="Shoppo" className="h-8" />
        </Link>
        <div className="flex items-center space-x-2">
          <Badge count={orderItems.length} size="small">
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              className="text-white"
              onClick={() => navigate("/cart")}
            />
          </Badge>
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="text-white"
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>
      <div className="px-4 pb-3">
        <Input
          className="w-full"
          placeholder="Search for products..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearchSubmit}
        />
      </div>
    </div>
  );

  const DesktopHeader = () => (
    <nav className="hidden md:block bg-gradient-to-r from-orange-600 to-orange-700 border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Original Seller Center and Help Center Section */}
        <div className="hidden md:flex items-center justify-between px-6 py-2 text-sm text-white/90 border-b border-white/10">
          <div className="flex items-center gap-6">
            <Link
              to="/sellercenter"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              Seller Center
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/helpcenter"
              className="hover:text-white transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* New Header Section with Logo, Search, Notifications, Cart, and User */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0">
            <img src={shoppo} alt="Shoppo" className="h-8 md:h-10" />
          </Link>

          {/* Search Bar */}
          <div className="flex items-center gap-6">
            <Input
              className="w-64 md:w-80"
              placeholder="Search for products..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={handleSearchChange}
              onPressEnter={handleSearchSubmit}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center gap-6">
            <Popover
              content={
                <div className="w-64">
                  {renderPromotions()}
                  <Divider />
                  <div className="p-4 text-center">
                    <Button
                      type="primary"
                      onClick={() => navigate(`/notifications/${userId}`)}
                      block
                    >
                      Go to Notifications
                    </Button>
                  </div>
                </div>
              }
              trigger="hover"
              placement="bottomRight"
            >
              <Badge count={promotions.length} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="text-white hover:text-orange-200"
                  aria-label="Promotions"
                />
              </Badge>
            </Popover>

            {/* Shopping Cart */}
            <Popover
              content={
                <div className="w-64">
                  {renderCartItems()}
                  <Divider />
                  <div className="p-4 text-center">
                    <Button
                      type="primary"
                      onClick={() => navigate("/cart")}
                      block
                    >
                      Go to Cart
                    </Button>
                  </div>
                </div>
              }
              trigger="hover"
              placement="bottomRight"
            >
              <Badge count={orderItems.length} size="small">
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined />}
                  className="text-white hover:text-orange-200"
                  aria-label="Shopping Cart"
                />
              </Badge>
            </Popover>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );

  const renderPromotions = () => {
    if (!promotions || promotions.length === 0) {
      return <div className="text-gray-500">No Promotion.</div>;
    }

    return promotions.map((promo) => (
      <div
        key={promo.ID || promo.promotion_name}
        className="bg-white p-4 rounded-lg shadow-md mb-4"
      >
        <h3 className="text-lg font-bold mb-2">{promo.promotion_name}</h3>
        <p className="text-gray-600">{promo.description}</p>
        <div className="mt-2 text-sm">
          <span>Start: {new Date(promo.start_date).toLocaleDateString()}</span>
          <span className="ml-4">
            End: {new Date(promo.end_date).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2 text-sm">
          <span>Discount: {promo.discount_value}</span>
          <span className="ml-4">Usage Limit: {promo.usage_limit}</span>
        </div>
      </div>
    ));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.trim();
    if (query) {
      navigate(`/search/${query}`);
    }
  };
  <div className="px-4 py-3 md:px-6 md:py-4">
    <div className="flex items-center gap-4">
      <Link to="/home" className="flex-shrink-0">
        <img src={shoppo} alt="Shoppo" className="h-8 md:h-10" />
      </Link>

      <div className="flex items-center gap-2 ml-auto">
        <Input
          className="w-full"
          placeholder="Search for products..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearchChange} // Trigger the URL change and search as the user types
          onPressEnter={handleSearchSubmit} // Keep the option to press Enter for final search submission
        />
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="text-white hover:text-orange-200"
            onClick={() => navigate("/notification")}
            aria-label="Notifications"
          />
        </Badge>

        <Popover
          content={
            <div className="w-64">
              {renderCartItems()}
              <Divider />
              <div className="p-4 text-center">
                <Button type="primary" onClick={() => navigate("/cart")} block>
                  Go to Cart
                </Button>
              </div>
            </div>
          }
          trigger="hover"
          placement="bottomRight"
        >
          <Badge count={orderItems.length} size="small">
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              className="text-white hover:text-orange-200"
              aria-label="Shopping Cart"
            />
          </Badge>
        </Popover>

        <Popover
          content={
            <div className="w-64">
              {renderPromotions()}
              <Divider />
              <div className="p-4 text-center">
                <Button
                  type="primary"
                  onClick={() => navigate("/notifications")}
                  block
                >
                  Go to Notifications
                </Button>
              </div>
            </div>
          }
          trigger="hover"
          placement="bottomRight"
        >
          <Badge count={promotions.length} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              className="text-white hover:text-orange-200"
              aria-label="Promotions"
            />
          </Badge>
        </Popover>

        <Divider type="vertical" className="hidden md:block bg-white/20" />
        <UserMenu />
      </div>
    </div>
  </div>;

  const MobileDrawer: React.FC = () => (
    <Drawer
      title={
        <div className="flex items-center justify-center p-4">
          <span className="font-semibold text-xl text-gray-800">Menu</span>
        </div>
      }
      placement="right"
      onClose={() => setMobileMenuOpen(false)}
      open={mobileMenuOpen}
      width="100%"
      bodyStyle={{ padding: 0 }}
      headerStyle={{ borderBottom: "none" }}
    >
      {user && (
        <div className="p-4 bg-orange-50 shadow-sm rounded-b-lg border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Avatar
              size={50}
              src={promo}
              icon={<UserOutlined />}
              className="border border-gray-300 shadow-sm"
            />
            <div>
              <div className="font-semibold text-lg text-gray-900">
                {user?.UserName || "Default Name"}
              </div>
              <div className="text-sm text-gray-600">
                {user?.Email || "Default email"}
              </div>
            </div>
          </div>
        </div>
      )}

      <Menu
        mode="vertical"
        className="border-t"
        items={[
          {
            key: "home",
            label: (
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition">
                <HomeOutlined className="text-gray-600" />
                <span>Home</span>
              </div>
            ),
            onClick: () => {
              navigate("/home");
              setMobileMenuOpen(false);
            },
          },
          {
            key: "profile",
            label: (
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition">
                <UserOutlined className="text-gray-600" />
                <span>Profile</span>
              </div>
            ),
            onClick: () => {
              navigate(`/profile/${userId}`);
              setMobileMenuOpen(false);
            },
          },
          {
            key: "orders",
            label: (
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition">
                <HistoryOutlined className="text-gray-600" />
                <span>Orders</span>
              </div>
            ),
            onClick: () => {
              navigate("/orders");
              setMobileMenuOpen(false);
            },
          },
          {
            key: "wallet",
            label: (
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition">
                <WalletOutlined className="text-gray-600" />
                <span>Wallet</span>
              </div>
            ),
            onClick: () => {
              navigate(`/wallet/${userId}`);
              setMobileMenuOpen(false);
            },
          },
          {
            key: "sellercenter",
            label: (
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition">
                <ShopOutlined className="text-gray-600" />
                <span>Seller Center</span>
              </div>
            ),
            onClick: () => {
              navigate("/sellercenter");
              setMobileMenuOpen(false);
            },
          },
          {
            key: "helpcenter",
            label: (
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-600 transition">
                <QuestionCircleOutlined className="text-gray-600" />
                <span>Help Center</span>
              </div>
            ),
            onClick: () => {
              navigate("/helpcenter");
              setMobileMenuOpen(false);
            },
          },
          {
            type: "divider",
          },
          {
            key: "logout",
            label: (
              <div className="flex items-center gap-3 text-red-600 hover:text-red-800 transition">
                <LogoutOutlined />
                <span>Logout</span>
              </div>
            ),
            onClick: handleLogout,
          },
        ]}
      />
    </Drawer>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading..." fullscreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
      <MobileDrawer />
      <main className={`flex-grow bg-gray-50 ${isMobile ? "mt-24" : ""}`}>
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About Shoppo</h3>
              <p className="text-gray-600 leading-relaxed">
                Shoppo was founded with a passion for bringing unique and
                high-quality products to our customers. From humble beginnings
                in a small storefront, we’ve grown into a trusted name in
                e-commerce, committed to excellence in every order. Our mission
                is to create a seamless shopping experience while offering the
                best products at great value.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Payment Methods
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <img
                  src={krungthai}
                  alt="Krungthai"
                  className="w-16 h-10 object-contain"
                />
                <img
                  src={green_bank}
                  alt="Green Bank"
                  className="w-16 h-10 object-contain"
                />
                <img src={scb} alt="SCB" className="w-16 h-10 object-contain" />
                <img
                  src={paypal}
                  alt="PayPal"
                  className="w-16 h-10 object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {[
                  {
                    href: "https://www.facebook.com/profile.php?id=61567670649556&locale=th_TH",
                    icon: fb,
                  },
                  {
                    href: "https://twitter.com",
                    icon: tw,
                  },
                  {
                    href: "https://www.instagram.com",
                    icon: ig,
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition"
                  >
                    <img src={social.icon} className="w-6 h-6 object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-gray-500">
            <p>© 2025 Shoppo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
