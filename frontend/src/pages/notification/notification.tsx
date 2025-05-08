import React, { useEffect, useState } from "react";
import ProfileBar from "../../components/profile/profile";
import { GetNotification, GetOrderByID } from "../../services/https";
import { PromotionInterface } from "../../interfaces/Promotion";
import { OrderInterface } from "../../interfaces/IOrder";
import "../profile/profile.css";

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<PromotionInterface[]>([]);
    const [orders, setOrders] = useState<OrderInterface[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState<boolean>(true);
    const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
    const [fxHoPromotion, setFxHoPromotion] = useState<boolean>(false); // Renamed state
    const [fxHoOrder, setFxHoOrder] = useState<boolean>(false); // Renamed state
    const userId = localStorage.getItem("id") || "0";

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await GetNotification();
                console.log("Notification Response:", response.data); // Debugging
                const sortedNotifications = response.data.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                setNotifications(sortedNotifications);
                setLoadingNotifications(false);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
                setLoadingNotifications(false);
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await GetOrderByID(userId);
                console.log("Order Response:", response.data); // Debugging
                setOrders(Array.isArray(response.data.order) ? response.data.order : []);
                setLoadingOrders(false);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                setLoadingOrders(false);
            }
        };

        fetchNotifications();
        fetchOrders();
    }, []);

    return (
        <div className="grid-container">
            {/* Profile Sidebar */}
            <ProfileBar />

            {/* Notification Main Content */}
            <main className="profile-main">
                <h1>Notifications</h1>
                <hr />

                {/* Promotions (Collapse functionality) */}
                <section>
                    <button
                        className="w-full text-left text-white font-semibold bg-orange-600 p-2 rounded-md flex justify-between items-center"
                        onClick={() => setFxHoPromotion(!fxHoPromotion)} // Renamed function
                    >
                        {fxHoPromotion ? (
                            <>
                                Promotions <span>↑</span>
                            </>
                        ) : (
                            <>
                                Promotions <span>↓</span>
                            </>
                        )}
                    </button>
                    {fxHoPromotion && ( // Renamed function
                        <div className="space-y-4 mt-2">
                            {loadingNotifications ? (
                                <p className="text-center text-gray-500">Loading promotions...</p>
                            ) : notifications.length === 0 ? (
                                <p className="text-center text-gray-500">No promotions available.</p>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.ID}
                                        className="flex items-start bg-orange-100 p-4 rounded-lg shadow hover:shadow-md transition"
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center text-4xl text-orange-500 mr-4">
                                            🔥
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {notification.promotion_name}
                                            </h3>
                                            <p className="text-gray-600">{notification.description}</p>
                                            <small className="text-gray-500">
                                                {new Date(notification.start_date).toLocaleDateString()}{" "}
                                                to {new Date(notification.end_date).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                <hr />

                {/* Orders (Collapse functionality) */}
                <section>
                    <button
                        className="w-full text-left text-white font-semibold bg-orange-600 p-2 rounded-md flex justify-between items-center"
                        onClick={() => setFxHoOrder(!fxHoOrder)} // Renamed function
                    >
                        {fxHoOrder ? (
                            <>
                                Orders <span>↑</span>
                            </>
                        ) : (
                            <>
                                Orders <span>↓</span>
                            </>
                        )}
                    </button>
                    {fxHoOrder && ( // Renamed function
                        <div className="space-y-4 mt-2">
                            {loadingOrders ? (
                                <p className="text-center text-gray-500">Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className="text-center text-gray-500">No orders found.</p>
                            ) : (
                                orders.map((order) => (
                                    <div
                                        key={order.ID}
                                        className="flex items-start bg-blue-100 p-4 rounded-lg shadow hover:shadow-md transition"
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center text-4xl text-blue-500 mr-4">
                                            📦
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Order #{order.ID}
                                            </h3>
                                            <p className="text-gray-600">
                                                Status: {order.Orderstatus?.Status || "Unknown"}
                                            </p>
                                            <small className="text-gray-500">
                                                {order.OrderDate
                                                    ? new Date(order.OrderDate).toLocaleDateString()
                                                    : "No date available"}
                                            </small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Notification;