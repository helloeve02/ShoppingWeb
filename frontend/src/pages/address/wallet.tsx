import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './wallet.css';
import { message } from 'antd';
import { GetWalletByID, GetPaymentByID, GetOrderByID } from "../../services/https";
import ProfileฺBar from '../../components/profile/profile';

const Wallet: React.FC = () => {
    const navigate = useNavigate();
    const [, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | undefined>();
    const [wallet, setWallet] = useState<number>(0);
    const [payment, setPayment] = useState<number>(0);
    const [ordertotalprice, setOrdertotalprice] = useState<number>(0);
    const userIdstr = localStorage.getItem("id");
    // const [ordertotalprice, setOrdertotalprice] = useState<number | undefined>(undefined);
    const [totalBalance, setTotalBalance] = useState<number | undefined>(undefined); // Store balance in state

    useEffect(() => {
        const storedUserId = localStorage.getItem('id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchWallet();
            fetchOrdertotalprice();
        }
    }, [userId]);

    useEffect(() => {
        if (userIdstr) {
            fetchGetPaymentByID(userIdstr);
        } else {
            message.error("User ID not found in localStorage.");
        }
    }, [userIdstr]);

    const calculateTotalBalance = () => {
        if (wallet !== undefined && payment !== undefined && ordertotalprice !== undefined) {
            const total = wallet - ordertotalprice;
            setTotalBalance(total);
        }
    };


    useEffect(() => {
        if (wallet !== null && payment !== null && ordertotalprice !== null) {
            calculateTotalBalance(); // Update balance when all data is available
        }
    }, [wallet, payment, ordertotalprice]);


    const fetchGetPaymentByID = async (userIdstr: string) => {
        try {
            const res = await GetPaymentByID(userIdstr);


            if (res.status === 200 && res.data && Array.isArray(res.data.payments)) {
                // รวมยอดเงินจาก payment ทั้งหมด
                const totalAmount = res.data.payments
                    .map((item: { Amount: number }) => item.Amount || 0) // ดึง Amount และ fallback เป็น 0 ถ้า undefined
                    .reduce((sum: number, amount: number) => sum + amount, 0); // รวมยอดทั้งหมด

                setPayment(totalAmount); // บันทึกผลรวมเป็นตัวเลข
            } else {
                message.error("ไม่พบข้อมูลการชำระเงิน");
            }
        } catch (error) {
            console.error("Error fetching payment data:", error);
            message.error("เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน");
        }
    };


    const fetchWallet = async () => {
        setLoading(true);
        try {
            const response = await GetWalletByID(userId);
            if (response.status === 200 && response.data) {
                // รวมยอดเงินทั้งหมดใน array
                const balance = response.data.reduce(
                    (total: number, item: { Balance: number }) => total + item.Balance,
                    0 // ค่าเริ่มต้นคือ 0
                );
                setWallet(balance); // ตั้งค่า balance เป็นตัวเลข
            } else {
                // message.error("No items found in your cart.");
            }
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        } finally {
            setLoading(false);
        }
    };


    const fetchOrdertotalprice = async () => {
        setLoading(true);
        try {
            const response = await GetOrderByID(userId);

            if (response.status === 200 && response.data && Array.isArray(response.data.order)) {
                // รวมราคาของทุก order
                const totalOrderPrice = response.data.order
                    .map((order: { TotalPrice: number }) => order.TotalPrice || 0) // ดึง TotalPrice และ fallback เป็น 0 ถ้า undefined
                    .reduce((sum: number, price: number) => sum + price, 0); // รวมยอดทั้งหมด

                setOrdertotalprice(totalOrderPrice); // บันทึกยอดรวม
            }
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="grid-container">
            <ProfileฺBar />
            <main className="profile-main">
                <h1>My Wallet</h1>
                <hr />
                <div className="wallet-content">
                    {/* Show total balance */}
                    <p>Your wallet balance is: <strong>฿{totalBalance?.toFixed(2) || "0.00"}</strong></p>
                    <button
                        className="wallet-topup-btn"
                        onClick={() => navigate('/payment')}
                    >
                        Top Up
                    </button>
                    <button className="wallet-history-btn" onClick={() => navigate('/transaction')}>Transaction History</button>
                </div>
            </main>
        </div>
    );
};

export default Wallet;
