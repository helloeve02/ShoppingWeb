import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    AiOutlineEnvironment,
    AiOutlineComment,
    AiOutlineShop,
    AiOutlineWallet,
    AiOutlineCopyrightCircle,
    AiFillContainer,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
    UsersInterface,
    AddressInterface,
    CartitemInterface,
    OrderInterface,
    OrderitemInterface,
    ShippingInterface,
} from "../../interfaces/IOrder";
import {
    GetAddress,
    GetUserById,
    CreateOrderItem,
    UpdateOrderIDForInvoice,
    DeleteInvoiceByID,
    DeleteSelectedCartItems

} from "../../services/https";
import { message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CreateOrder, GetShipping, GetWalletByID } from "../../services/https";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const Orderes: React.FC = () => {
    const location = useLocation();
    // const {
    //   selectedItems = [],
    //   cartItems = [],
    // }: { selectedItems: number[]; cartItems: CartitemInterface[] } =
    //   location.state || {};

    const { selectedItems, CartById, invoiceData } = location.state || {
        selectedItems: [],
        CartById: [],
        invoiceData: "",
    };
    const [users, setUsers] = useState<UsersInterface | null>(null);
    const [address, setAddress] = useState<AddressInterface | null>(null);
    const [shipping, setShipping] = useState<ShippingInterface[] | null>(null);
    const navigate = useNavigate();
    const userIdstr = localStorage.getItem("id");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedShippingID, setSelectedShippingID] = useState<
        number | undefined
    >(undefined);
    const [wallet, setWallet] = useState<number | undefined>(undefined);
    const { productId, productName, quantity, totalPrice } = location.state || {
        productId: null,
        productName: "",
        quantity: 1,
        totalPrice: 0,

    };

    useEffect(() => {
        if (userIdstr) {
            fetchUserData(userIdstr);
            fetchAddressData(userIdstr);
            fetchWallet(userIdstr);
        } else {
            message.error("The user ID was not found in localStorage.");
        }
    }, [userIdstr]);


    const fetchUserData = async (userIdstr: string) => {
        try {
            const res = await GetUserById(userIdstr);
            if (res.status === 200 && res.data) {
                setUsers(res.data); // กำหนดให้เป็น object ที่ได้จาก API
            } else {
                setUsers(null); // ถ้าไม่มีข้อมูล ให้กำหนดเป็น null
                message.error("No Collection !!!");
            }
        } catch (error) {
            setUsers(null); // กำหนดให้เป็น null เมื่อมี error
            message.error("Your viewing collection is not yet available.");
        }
    };

    const getShipping = async () => {
        try {
            const res = await GetShipping();
            if (res?.data) {
                setShipping(res.data);
            } else {
                setError("Failed to load cart items");
            }
        } catch (error) {
            setError("Error fetching cart items. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true); // Set loading state
        getShipping();
    }, []);

    const fetchAddressData = async (userIdstr: string) => {
        try {
            const res = await GetAddress(userIdstr);

            if (res.status === 200 && res.data && res.data.length > 0) {
                setAddress(res.data[0]); // ใช้ที่อยู่แรกใน array
            } else {
                setAddress(null);
                message.error("No Address Available!");
            }
        } catch (error) {
            console.error("Error fetching address:", error); // ตรวจสอบข้อผิดพลาด
            setAddress(null);
            message.error("Your viewing address is not yet available.");
        }
    };

    const fetchWallet = async (userIdstr: string) => {
        try {
            const response = await GetWalletByID(userIdstr);
            if (response.status === 200 && response.data.length > 0) {
                // เลือกยอดเงินจากรายการสุดท้าย
                const latestBalance = response.data[response.data.length - 1].Balance;
                setWallet(latestBalance);
            }
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
    };

    const selectedCartItems = (CartById || []).filter((item: CartitemInterface) =>
        (selectedItems || []).includes(item.ID!)
    );


    const handlePayment = async () => {
        if (!users) {
            message.error("ข้อมูลผู้ใช้ไม่พร้อมใช้งาน");
            return;
        }

        const totalPrice = calculateTotalPayment(); // คำนวณราคารวม

        if (Number(wallet) < totalPrice) {
            message.error("ยอดเงินในกระเป๋าไม่เพียงพอสำหรับการชำระเงิน");
            return;
        }
        // สร้างคำสั่งซื้อ (OrderInterface)
        const orderData: OrderInterface = {
            TotalPrice: totalPrice,
            OrderDate: new Date(),
            OrderstatusID: 3, // สถานะคำสั่งซื้อ (pending) อยากลาออก
            UserID: users.ID,
            ShippingID: selectedShippingID,
        };

        try {

            const orderResponse = await CreateOrder(orderData); // เรียก API สร้างคำสั่งซื้อ
            const orderID = orderResponse.data.orderID;

            if (orderResponse.status === 201 && orderResponse.data) {
                const createdOrderID = orderResponse.data.data.ID; // ดึง OrderID ที่สร้างขึ้น

                // สร้างรายการคำสั่งซื้อ (OrderitemInterface[])
                const orderItems: OrderitemInterface[] = selectedCartItems.map(
                    (item: { Quantity: any; Product: { price: any; ID: any } }) => ({
                        Quantity: item.Quantity,
                        Price: item.Product?.price,
                        TotalPrice: item.Quantity! * (item.Product?.price || 0),
                        ProductID: item.Product?.ID,
                        UserID: users.ID,
                        OrderID: createdOrderID,
                        WalletsID: users.ID,
                    })
                );

                const orderItemsResponse = await CreateOrderItem(orderItems);

                if (orderItemsResponse.status === 201) {
                    message.success("สร้างคำสั่งซื้อสำเร็จ!");

                    // ลบสินค้าที่เลือกออกจากตะกร้าสินค้า
                    if (userIdstr) {
                        await deleteSelectedCartItems(userIdstr, selectedItems);

                    } else {
                        console.error("userIdstr is null or undefined");
                        message.error("เกิดข้อผิดพลาด: ไม่สามารถดำเนินการได้ เนื่องจากไม่พบ userId.");
                    }


                    UpdateOrderIDForInvoice(invoiceData, orderID);

                    // นำทางไปยังหน้าชำระเงิน
                    navigate("/orders", {
                        state: { selectedItems: Array.from(selectedItems), CartById },
                    });
                    window.location.reload()
                } else {
                    const errorMessage =
                        orderItemsResponse.data?.message ||
                        `ไม่สามารถสร้างรายการคำสั่งซื้อได้: ${orderItemsResponse.statusText}`;
                    message.error(errorMessage);
                }
            } else {
                const errorMessage =
                    orderResponse.data?.message ||
                    `ไม่สามารถสร้างคำสั่งซื้อได้: ${orderResponse.statusText}`;
                message.error(errorMessage);
            }
        } catch (error: any) {
            console.error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ:", error);
            message.error(
                error instanceof Error
                    ? `Error: ${error.message}`
                    : "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ"
            );
        }
    };

    // ฟังก์ชันสำหรับลบสินค้าที่เลือก
    const deleteSelectedCartItems = async (userIdstr: string, selectedItems: number[]) => {
        try {
            // สร้างอาร์เรย์ของ Promises สำหรับการลบสินค้า
            const deletePromises = selectedItems.map((itemID) => {
                const item = selectedCartItems.find((cartItem: CartitemInterface) => cartItem.ID === itemID);
                if (item && item.Product) {
                    // ส่ง ProductID ไปลบสินค้าจาก Cart
                    const productID = item.Product.ID;
                    return DeleteSelectedCartItems(userIdstr, productID);
                }
                return Promise.resolve(); // ถ้าไม่พบสินค้า ก็จะเป็น resolved promise
            });

            // ใช้ Promise.all เพื่อรอให้คำขอลบทั้งหมดเสร็จสิ้น
            await Promise.all(deletePromises);

            message.success("ลบสินค้าที่เลือกจากตะกร้าสำเร็จ");
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบสินค้า:", error);
            message.error("เกิดข้อผิดพลาดในการลบสินค้า กรุณาลองใหม่อีกครั้ง");
        }
    };




    const [shippingCost, setShippingCost] = useState(50);

    const calculateTotal = (): number =>
        selectedCartItems.reduce(
            (total: number, item: CartitemInterface) =>
                total + item.Quantity! * (item.Product?.price || 0),
            totalPrice
        );

    const calculateTotalPayment = (): number => {
        const merchandiseSubtotal = calculateTotal(); // Dynamically calculate the subtotal
        return merchandiseSubtotal + shippingCost; // Add shipping cost
    };

    const handleShippingChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const shippingFee = parseInt(event.target.value, 10);
        const shippingID = parseInt(
            selectedOption.getAttribute("data-id") || "0",
            10
        );


        setShippingCost(shippingFee); // อัปเดตค่าขนส่ง
        setSelectedShippingID(shippingID); // เก็บ ShippingID ที่เลือก
    };

    const handleRequestInvoiceClick = () => {
        navigate("/order/invoice", {
            state: { selectedItems: Array.from(selectedItems), CartById },
        });
    };

    return (
        <div className="bg-gray-50 flex justify-center items-center  w-full">
            <div className="ant-card-body flex flex-col w-full max-w-5xl p-6 rounded shadow-lg">
                <ArrowLeftOutlined
                    onClick={() => {
                        navigate("/cart");
                        if (invoiceData) {
                            DeleteInvoiceByID(invoiceData);
                        }
                    }}
                />

                <div className="flex-1 p-6 max-w-full">
                    {/* Delivery Information */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                        <h2 className="text-3xl font-bold flex items-center gap-2 text-black mb-2">
                            <AiOutlineEnvironment className="text-yellow-500" /> Delivery
                            Information
                            <span className="text-gray-700 text-right text-xl font-normal ml-auto">
                                <div className="font-xs text-gray-500">
                                    <EditOutlined onClick={() => navigate(`/address/${userIdstr}`)} />
                                    {users?.FirstName} {users?.LastName} {users?.Phone}
                                </div>
                                <div className="font-xs text-gray-500">
                                    {address ? (
                                        <>

                                            <div>{address.Name || "Unnamed Address"}</div>
                                            <div>{address.Address || ""}</div>
                                            <div>
                                                {address.SubDistrict && `${address.SubDistrict}, `}
                                                {address.District && `${address.District}, `}
                                                {address.Province && `${address.Province}, `}
                                                {address.PostalCode || ""}
                                            </div>
                                            <div>Tel: {address.PhoneNumber || "N/A"}</div>
                                        </>
                                    ) : (
                                        "No Address Available"
                                    )}
                                </div>
                            </span>
                        </h2>
                    </div>

                    {/* Products Ordered */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                        <h2 className="text-3xl font-bold flex items-center gap-2 text-black mb-2">
                            <AiOutlineShop className="text-yellow-500" />
                            Products Ordered |
                            <Link
                                to="/helpcenter"
                                className="text-blue-500 text-base font-normal ml-1 mt-1 flex items-center hover:underline hover:font-semibold"
                            >
                                <AiOutlineComment className="text-blue-500 mt-1" /> Chat now
                            </Link>
                        </h2>
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="text-left p-1">Product</th>
                                    <th className="text-left p-2">Product Name</th>
                                    <th className="text-left p-3">Price</th>
                                    <th className="text-left p-4">Quantity</th>
                                    <th className="text-left p-5">Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCartItems.map((item: CartitemInterface, index: number) => (
                                    <tr key={item.ID}>
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2 w-full whitespace-normal">
                                            {item.Product?.product_name || "No name"}
                                        </td>
                                        <td className="p-2">
                                            {item.Product?.price?.toFixed(2) || "0.00"}
                                        </td>
                                        <td className="p-2 text-center">{item.Quantity}</td>
                                        <td className="p-2">
                                            {(item.Quantity! * (item.Product?.price || 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}

                                {productId && (
                                    <tr key={productId}>
                                        <td className="p-2">{selectedCartItems.length + 1}</td>
                                        <td className="p-2 w-full whitespace-normal">
                                            {productName || "Unnamed Product"}
                                        </td>
                                        <td className="p-2">{(totalPrice / quantity)?.toFixed(2) || "0.00"}</td>
                                        <td className="p-2 text-center">{quantity || 1}</td>
                                        <td className="p-2">
                                            {((totalPrice || 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Price */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                        <h2 className="text-3xl font-bold flex items-center gap-2 text-black mb-2 justify-between">
                            <span className="flex items-center gap-2">
                                <AiOutlineWallet className="text-yellow-500" /> Total Prices
                            </span>
                            <span className="text-right">{calculateTotal().toFixed(2)}</span>
                        </h2>
                    </div>

                    {/* Shipping Option */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-black flex items-center gap-2">
                                <AiOutlineEnvironment className="text-yellow-500" />
                                Shipping Option
                            </h2>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <select
                                    onChange={handleShippingChange}
                                    className="py-2 px-4 border rounded"
                                >
                                    {shipping?.map((option) => (
                                        <option
                                            key={option.ID}
                                            value={option.Fee}
                                            data-id={option.ID}
                                        >
                                            {option.ShippingName} - {option.Fee} บาท
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                        <h2 className="text-3xl font-bold flex items-center gap-2 text-black mb-2 justify-between">
                            <span className="flex items-center gap-2">
                                <AiFillContainer className="text-yellow-500" /> Invoice
                            </span>
                            <Button onClick={handleRequestInvoiceClick}>
                                Request Invoice
                            </Button>
                        </h2>
                    </div>

                    {/* /* Total Payment */}
                    {/* <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold flex items-center gap-2 text-black">
              <AiOutlineCopyrightCircle className="text-yellow-500" /> Payment Wallet
            </div>
          </div>
          <div className=" p-6 mb-5 w-full">
            <div className="text-gray-500 text-right">
              Merchandise Subtotal: {selectedCartItems
                .reduce((total, item) => total + (item.Quantity! * (item.Product?.price || 0)), 0)
                .toFixed(2)}
            </div>
            <div className="text-gray-500 text-right">
              Shipping Subtotal: {shippingCost.toFixed(2)}
            </div>
            <div className="text-2xl font-bold text-right mt-2 text-orange-500">
              Total Payment: {calculateTotalPayment().toFixed(2)}
            </div>
          </div>
        </div> */}
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold flex items-center gap-2 text-black">
                                <AiOutlineCopyrightCircle className="text-yellow-500" /> Payment
                                Wallet
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
                            <div className="flex flex-col items-end">
                                {/* Merchandise Subtotal */}
                                <div className="flex justify-between w-full max-w-screen">
                                    <span className="text-gray-500">Merchandise Subtotal:</span>
                                    <span className="text-black font-medium">
                                        ฿
                                        {selectedCartItems
                                            .reduce(
                                                (
                                                    total: number,
                                                    item: { Quantity: any; Product: { price: any } }
                                                ) =>
                                                    total + item.Quantity! * (item.Product?.price || 0),
                                                totalPrice
                                            )
                                            .toFixed(2)}
                                    </span>
                                </div>

                                {/* Shipping Subtotal */}
                                <div className="flex justify-between w-full max-w-screen mt-2">
                                    <span className="text-gray-500">Shipping Subtotal:</span>
                                    <span className="text-black font-medium">
                                        ฿{shippingCost.toFixed(2)}
                                    </span>
                                </div>

                                {/* Total Payment */}
                                <div className="flex justify-between w-full max-w-screen mt-4 border-t pt-4">
                                    <span className="text-lg font-bold">Total Payment:</span>
                                    <span className="text-2xl font-bold text-orange-500">
                                        ฿{calculateTotalPayment().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Note and Place Order Button */}
                            <div className="flex flex-col items-end mt-4">
                                <p className="text-gray-500 text-sm text-right max-w-screen">
                                    By clicking 'Place Order', you state acknowledgement and
                                    acceptance of our Return and Refund policy for this
                                    transaction.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            type="primary"
                            size="large"
                            style={{ fontSize: "18px", padding: "15px 30px" }}
                            onClick={handlePayment}
                        >
                            PAY
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Orderes;
