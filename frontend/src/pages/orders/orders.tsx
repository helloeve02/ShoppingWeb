import { useEffect, useState } from "react";
import { message } from "antd";
import logo from "../../assets/shoppoicon.png";
import promo from "../../assets/promo.jpg";
import { useNavigate } from "react-router-dom";
import {
  GetOrderItemsByUserID,
  GetShopNameByUserID,
  RecievedOrder,
  UpdateWalletByUserID,
} from "../../services/https";
import { OrderInterface, OrderitemInterface } from "../../interfaces/IOrder";

const Orders = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("id");
  const [shopNames, setShopNames] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState<OrderitemInterface[]>([]);

  const getShopNameByUserID = async (id: string): Promise<string> => {
    try {
      const res = await GetShopNameByUserID(id);
      if (res.status === 200) {
        return res.data;
      }
      return "Unknown Shop";
    } catch (error) {
      messageApi.error("Failed to fetch shop name");
      return "Unknown Shop";
    }
  };

  const handleRecievedOrder = async (
    orderID: string,
    sellerID: string,
    totalPrice: string
  ) => {
    const updateWalletForSeller = await UpdateWalletByUserID(
      sellerID,
      totalPrice
    );
    if (updateWalletForSeller.status === 200) {
      messageApi.success(updateWalletForSeller.data.message);
      const recievedOrder = await RecievedOrder(orderID);
      if (recievedOrder.status === 200) {
        messageApi.success(recievedOrder.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        message.error(recievedOrder.data.error);
      }
    } else {
      message.error(updateWalletForSeller.data.error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const isBase64 = (str: string) => {
    const base64Regex = /^([A-Za-z0-9+\/=]|\n|\r)+$/;
    return base64Regex.test(str);
  };

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return promo;

    if (isBase64(image)) {
      return `data:image/jpeg;base64,${image}`;
    }

    return image.startsWith("http")
      ? image
      : `https://mediam.dotlife.store/media/cata/${image}`;
  };

  const handlePrint = (
    order: OrderInterface | undefined,
    items: OrderitemInterface[]
  ) => {
    const orderDateFormatted = formatDate(order?.OrderDate?.toString() || "");

    const rows =
      items
        .map(
          (item) => `
        <tr>
          <td>${item.Product?.product_name || "N/A"}</td>
          <td>${item.Quantity || 0}</td>
          <td>฿${item.Price || 0}</td>
          <td>฿${(item.Quantity || 0) * (item.Price || 0)}</td>
        </tr>`
        )
        .join("") || "";

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Pop-up was blocked by the browser. Please enable pop-ups.");
      return;
    }

    const totalAmount = items.reduce(
      (total, item) => total + (item.Quantity || 0) * (item.Price || 0),
      0
    );

    const vatAmount = totalAmount * 0.07;

    const printContent = `
      <html>
        <head>
          <title>Invoice Information</title>
          <style>
            @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
          }
          .header h1 {
            color: #1f2937;
            font-size: 24px;
            margin: 0 0 0.5rem 0;
          }
          .header p {
            color: #6b7280;
            margin: 0;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          .info-box {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            width: 45%;
          }
          .info-box h2 {
            font-size: 16px;
            color: #374151;
            margin: 0 0 0.5rem 0;
          }
          .info-box p {
            margin: 0;
            font-size: 14px;
            color: #4b5563;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
          }
          .items-table th {
            background: #f3f4f6;
            padding: 0.75rem;
            text-align: left;
            font-size: 14px;
            color: #374151;
          }
          .items-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .items-table tr:last-child td {
            border-bottom: none;
          }
          .total-section {
            justify-content: flex-start; /* จัดตำแหน่งไปทางซ้าย */
          }
          .total-box {
            width: 200px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }
          .total-row.final {
            justify-content: space-center;
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
          }
          .footer {
            margin-top: 3rem;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice Information</h1>
              <p>Type: ${order?.Invoice?.[0]?.InvoiceType?.Name ?? "N/A"}</p>
            </div>
  
            <div class="info-section">
              <div class="info-box">
                <h2>Order Detail</h2>
                <p><strong>Order ID:</strong> ${order?.ID}</p>
                <p><strong>Order Date:</strong> ${orderDateFormatted}</p>
                <p><strong>Order Status:</strong> ${order?.Orderstatus?.Status}</p>
              </div>
              <div class="info-box">
                <h2>Customer Information</h2>
                <p><strong>Full Name:</strong> ${order?.Invoice?.[0]?.FullName
      }</p>
                <p><strong>Tax ID:</strong> ${order?.Invoice?.[0]?.TaxID}</p>
                <p><strong>Email:</strong> ${order?.Invoice?.[0]?.Email}</p>
              </div>
            </div>
  
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
  
            <div class="total-section">
              <div class="total-box">
                <div class="total-row final">
                  <span>Product Price:</span>
                  <span>฿${(totalAmount - vatAmount).toFixed(2)}</span>
                </div>
                <div class="total-row final">
                  <span>VAT 7%:</span>
                  <span>฿${vatAmount.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                  <span>Total Amount:</span>
                  <span>฿${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
  
            <div class="footer">
              <p>Thank you for your order!</p>
              <p>If you have any questions, please contact our support team.</p>
              <p>© 2025 Shoppo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const groupedOrdersByUserAndDate = orderItems.reduce((acc, item) => {
    const userId = item.Product?.user_id?.toString();
    const orderDate = item.Order?.OrderDate ? item.Order.OrderDate.toString() : "";
    if (userId && orderDate) {
      const groupKey = `${userId}_${orderDate}`; // Combine `user_id` and `OrderDate` as key
      if (!acc[groupKey]) {
        acc[groupKey] = {
          userId,
          orderDate,
          items: [],
        };
      }
      acc[groupKey].items.push(item);
    }
    return acc;
  }, {} as Record<string, { userId: string; orderDate: string; items: OrderitemInterface[] }>);

  // Sort by `OrderDate` in descending order
  const sortedGroups = Object.entries(groupedOrdersByUserAndDate).sort(
    ([, groupA], [, groupB]) =>
      new Date(groupB.orderDate).getTime() -
      new Date(groupA.orderDate).getTime()
  );

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

  const handleRateClick = (items: OrderitemInterface[]) => {
    navigate("/orders/review", {
      state: { orderItems: items },
    });
  };

  const handleReturnClick = (item: any) => {
    navigate("/orders/return", { state: { orderItem: item } });
  };

  const handleReturnStatusClick = (items: OrderitemInterface[]) => {
    navigate("/orders/return-status", { state: { orderItem: items } });
  };

  useEffect(() => {
    getOrderItemsByUserID(userID || "");
  }, [userID]);

  useEffect(() => {
    const fetchShopNames = async () => {
      // Create an array of user IDs to fetch shop names for
      const userIds = orderItems.map(item => item.Product?.user_id?.toString()).filter(Boolean);

      // Ensure no duplicate userIds
      const uniqueUserIds = [...new Set(userIds)];

      // Fetch shop names for each unique user ID
      for (const id of uniqueUserIds) {
        if (id && !shopNames[id]) {
          const shopName = await getShopNameByUserID(id);
          setShopNames(prev => ({ ...prev, [id]: shopName }));
        }
      }
    };

    if (orderItems.length) {
      fetchShopNames();
    }
  }, [orderItems]);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col">
        {/* Header section */}
        <div className="flex w-full min-h-[10vh] border-b items-center bg-white">
          <div className="flex flex-row divide-x items-center max-w-7xl w-full mx-auto px-4">
            <div className="flex flex-row gap-1 text-orange-600 text-[3vh] sm:text-[4vh] items-center font-bold ">
              <img src={logo} className="object-cover h-[5vh] sm:h-[7vh]" />
              <h1>MY ORDERS</h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {sortedGroups.map(([groupKey, group]) => (
          <div
            className="flex flex-col max-w-7xl w-full mx-auto px-4 mt-[3vh]"
            key={groupKey}
          >
            <div className="bg-white w-full mx-auto flex flex-col px-8 py-[2vh] rounded-lg shadow-lg">
              {/* Display User and Order Date */}
              <div className="divide-y divide-gray-200">
                <div className="flex flex-row justify-between items-center mb-[1vh]">
                  <div className="flex flex-row items-center">
                    <strong>{shopNames[group.items[0].Product?.user_id?.toString() || ""]}</strong>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <strong>Status:</strong>
                    <p>{group.items[0].Order?.Orderstatus?.Status}</p>
                  </div>
                </div>

                {/* Order Items Section */}
                {group.items.map((item) => (
                  <div
                    className="flex flex-row py-[2vh] px-[2vh] items-center"
                    key={item.ID}
                  >
                    <img
                      src={getImageUrl(
                        item.Product?.product_images?.[0]?.image || ""
                      )}
                      className="object-cover h-[10vh] w-[10vh] rounded-full bg-gray-50"
                    />
                    <div className="flex flex-col ml-[3vh]">
                      <h1 className="font-bold">
                        {item.Product?.product_name}
                      </h1>
                      <h3 className="mt-[1vh]">x{item.Quantity}</h3>
                    </div>
                    <h2 className="flex ml-auto text-right">{`฿${(item.Price || 0) * (item.Quantity || 0)
                      }`}</h2>
                  </div>
                ))}

                <div className="flex pt-2 ml-auto items-center">
                  {(
                    group.items[0].Order?.Orderstatus?.Status || ""
                  ).toString() === "Shipped" && (
                      <div className="flex gap-2">
                        <button
                          className="flex min-h-[3vh] bg-orange-600 hover:bg-orange-700 items-center text-white p-[1vh] rounded-md"
                          onClick={() =>
                            handleRecievedOrder(
                              group.items[0].OrderID?.toString() || "",
                              group.items[0].Product?.user_id?.toString() || "",
                              group.items[0].Order?.TotalPrice?.toString() || ""
                            )
                          }
                        >
                          Recieved Order
                        </button>

                        <button
                          className="flex min-h-[3vh] bg-white hover:bg-gray-200 items-center text-orange-600 ring-orange-600 ring-1 p-[1vh] rounded-md"
                          onClick={() => handleReturnClick(group.items)}
                        >
                          Return / Refund
                        </button>
                      </div>
                    )}
                  {(
                    group.items[0].Order?.Orderstatus?.Status || ""
                  ).toString() === "Returned" && (
                      <div className="flex gap-2">
                        <button
                          className="flex min-h-[3vh] bg-orange-600 hover:bg-orange-700 items-center text-white p-[1vh] rounded-md"
                          onClick={() => handleReturnStatusClick(group.items)}
                        >
                          View Return Status
                        </button>
                      </div>
                    )}
                  {(
                    group.items[0].Order?.Orderstatus?.Status || ""
                  ).toString() === "Completed" && (
                      <div className="flex gap-2">
                        <button
                          className="flex min-h-[3vh] bg-orange-600 hover:bg-orange-700 items-center text-white p-[1vh] rounded-md"
                          onClick={() => handleRateClick(group.items)}
                        >
                          Rate
                        </button>
                        {Array.isArray(group.items[0].Order?.Invoice) &&
                          group.items[0].Order.Invoice.length > 0 &&
                          group.items[0].Order.Invoice[0].ID &&
                          group.items[0].Order.Invoice[0].ID !== undefined && (
                            <button
                              className="flex min-h-[3vh] bg-white hover:bg-gray-200 items-center text-orange-600 ring-orange-600 ring-1 p-[1vh] rounded-md"
                              onClick={() =>
                                handlePrint(
                                  group.items[0].Order || undefined,
                                  group.items
                                )
                              }
                            >
                              Download Invoice
                            </button>
                          )}
                      </div>
                    )}
                  <strong className="mr-1 ml-auto justify-right">
                    Total Price:
                  </strong>
                  {`฿${group.items[0].Order?.TotalPrice}`}
                </div>
              </div>
            </div>
          </div>
        ))}
        {sortedGroups.length === 0 && (
          <div className="flex flex-col max-w-7xl w-full mx-auto px-4 mt-[3vh] text-center">
            No orders found
          </div>
        )}
      </div>
      <footer className="mt-[3vh]" />
    </>
  );
};

export default Orders;
