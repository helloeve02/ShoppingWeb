import React, { useEffect, useState } from "react";
import { CartitemInterface } from "../../interfaces/IOrder";
import { DeleteOutlined, MinusOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Card, Button, Alert, Checkbox, Spin, Space, Typography, message, Modal, InputNumber } from "antd";
import { DeleteCartitem, GetCartById, UpdateCart } from "../../services/https";
import { useNavigate } from "react-router-dom";
import promo from "../../assets/promo.jpg";

const { Text, Title } = Typography;

const CartItemComponent: React.FC = () => {
  const [CartById, setCartById] = useState<CartitemInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const userIdstr = localStorage.getItem("id");

  // Fetch cart items by user ID
  const fetchGetCartById = async (userIdstr: string) => {
    setIsLoading(true);
    try {
      const res = await GetCartById(userIdstr);

      if (res.status === 200 && res.data && res.data.length > 0) {
        setCartById(res.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      message.error("Failed to load your cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (CartById.length === selectedItems.size) {
      // Deselect all items
      setSelectedItems(new Set());
    } else {
      // Select all items
      const allItemIds = CartById.map(item => item.ID!);
      setSelectedItems(new Set(allItemIds));
    }
  };


  useEffect(() => {
    if (userIdstr) {
      fetchGetCartById(userIdstr);
    } else {
      message.error("User ID not found in localStorage.");
      setIsLoading(false);
    }
  }, [userIdstr]);

  // Update cart item quantity
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // ป้องกันปริมาณที่ไม่ถูกต้อง
    setIsUpdating(true);
    try {
      // การอัปเดต UI แบบเชิงบวก (Optimistic UI update)
      setCartById((items) =>
        items.map((item) =>
          item.ID === itemId ? { ...item, Quantity: newQuantity } : item
        )
      );

      // สมมุติว่า `UpdateCart` รับ itemId และ newQuantity
      const response = await UpdateCart(itemId, newQuantity);

      if (response.data?.message === "Update successful") {
        // การจัดการความสำเร็จ (ถ้าจำเป็น ขึ้นอยู่กับกรณีการใช้งาน)
      } else {
        // การจัดการข้อผิดพลาดในกรณีที่ API ส่งกลับสถานะล้มเหลว
        setError("ไม่สามารถอัปเดตปริมาณได้ โปรดลองใหม่อีกครั้ง");
      }
    } catch (error) {
      // จับข้อผิดพลาดจากเครือข่ายหรือข้อผิดพลาดที่ไม่คาดคิด
      setError("ไม่สามารถอัปเดตปริมาณได้ โปรดลองใหม่อีกครั้ง");
    } finally {
      setIsUpdating(false);
    }
  };



  // Delete cart item with confirmation
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this item from your cart?",
      onOk: async () => {
        setIsUpdating(true);
        try {
          await DeleteCartitem(id);
          setCartById(items => items.filter(item => item.ID !== id));
          setSelectedItems(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          window.location.reload()
        } catch (error) {
          console.error("Error deleting item:", error);
          setError("Failed to delete item. Please try again.");
        } finally {
          setIsUpdating(false);
        }
      },
    });
  };

  const toggleSelectItem = (itemId: number) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Calculate total price for selected items
  const calculateTotal = (): number => {
    return CartById.filter(item => selectedItems.has(item.ID!))
      .reduce((total, item) => total + (item.Quantity! * (item.Product?.price || 0)), 0);
  };

  // Loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <Card className="w-full h-full max-w-4xl mx-auto m-8">
      <Title level={4}>Shopping Cart</Title>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Checkbox
            checked={CartById.length > 0 && CartById.every(item => selectedItems.has(item.ID!))}
            onChange={() => toggleSelectAll()}
            className="mr-4"
          />
          <Text className="text-l font-semibold">Select All</Text>
          {/* <Button
            className="ant-btn-danger"  // Add the danger class to style the button as a danger button
            onClick={handleDeleteAll}
            disabled={selectedItems.size === 0}  // ปิดปุ่มถ้าไม่มีรายการที่เลือก
          >
            Delete All
          </Button> */}
        </div>
        {CartById.length > 0 ? (
          CartById.map(item => (
            <Card key={item.ID} className="mb-4" bodyStyle={{ padding: "12px" }}>
              <div className="flex items-center">
                <Checkbox
                  checked={selectedItems.has(item.ID!)}
                  onChange={() => toggleSelectItem(item.ID!)}
                  className="mr-4"
                />
                <div className="mr-4">
                  {item.Product?.product_images?.length ? (
                    <div
                      className="w-16 h-16 bg-cover bg-center rounded-md"
                      style={{ backgroundImage: `url(${item.Product.product_images[0]?.image || promo})` }}
                    // onClick={() => showModal(item.Product)}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md">
                      <Text type="secondary">No Image</Text>
                    </div>
                  )}
                </div>



                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <Text strong>{item.Product?.product_name || "No name"}</Text>
                  <Text type="secondary">
                    ฿{item.Product?.price ? item.Product.price.toFixed(2) : "0.00"}
                  </Text>
                  <Space>
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(item.ID!, item.Quantity! - 1)}
                      disabled={item.Quantity! <= 1 || isUpdating}
                    />
                    <InputNumber
                      className="w-16 text-center"
                      min={1}
                      value={item.Quantity}
                      onChange={(value) => handleQuantityChange(item.ID!, value ?? 1)} // ถ้า value เป็น null ให้ใช้ค่าเริ่มต้นเป็น 1
                      disabled={isUpdating}
                    />
                    {/* <Text className="w-12 text-center">{item.Quantity}</Text> */}
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => {
                        if (item.Quantity! + 1 <= (item.Product?.stock || 0)) {
                          handleQuantityChange(item.ID!, item.Quantity! + 1);
                        } else {
                          message.warning("Quantity exceeds available stock!");
                        }
                      }}
                      disabled={isUpdating}
                    />
                  </Space>
                  <div className="flex items-center justify-between">
                    <Text strong type="success">
                      ฿{(item.Quantity! * (item.Product?.price || 0)).toFixed(2)}
                    </Text>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(item.ID!)}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Text>Your cart is empty.</Text>
            <br />
            <Button type="primary" onClick={() => navigate("/home")}>
              Browse Products
            </Button>
          </div>
        )}
      </div>

      {CartById.length > 0 && (
        <div className="flex justify-between items-center border-t pt-4 mt-4">
          <Space>
            <Text type="secondary">Selected items:</Text>
            <Text strong>{selectedItems.size}</Text>
          </Space>
          <Space size="large">
            <div className="text-right">
              <Text type="secondary">Total:</Text>
              <br />
              <Text strong style={{ fontSize: "1.25rem", color: "#1890ff" }}>
                ฿{calculateTotal().toFixed(2)}
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              disabled={selectedItems.size === 0 || isUpdating}
              onClick={() =>
                navigate("/order", {
                  state: { selectedItems: Array.from(selectedItems), CartById },
                })
              }
            >
              Checkout
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default CartItemComponent;
