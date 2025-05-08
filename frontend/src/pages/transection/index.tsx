import React, { useEffect, useState } from "react";
import "../profile/profile.css";
import { GetTransectionById, GetPaymentStatusById } from "../../services/https";
import { TransectionInterface } from "../../interfaces/ITransaction";
import { message } from "antd";
import { format } from "date-fns"; // You can use date-fns to format the date

const TransactionTable: React.FC = () => {
  const [transactionsById, setTransactionsById] = useState<TransectionInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId = Number(localStorage.getItem("id")) as number;
  // Function to fetch transactions by user ID
  const fetchGetTransactionsById = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API call if it's different
      const response = await GetTransectionById(userId.toString());
      if (response.status === 200) {
        // Assuming response.data contains transactions with PaymentID
        const transactionsWithStatus = await Promise.all(response.data.map(async (transaction: any) => {
          try {
            const paymentStatus = await GetPaymentStatusById(transaction.PaymentID);
            // ตรวจสอบว่า paymentStatus มีค่าหรือไม่และมี data[0].status หรือไม่
            const status = paymentStatus?.data?.[0]?.status ?? "Unknown"; // เข้าถึง status จาก data[0]
            return {
              ...transaction,
              PaymentStatus: status, // เพิ่ม PaymentStatus ที่ตรวจสอบแล้ว
            };
          } catch (error) {
            console.error('Error fetching payment status:', error);
            return {
              ...transaction,
              PaymentStatus: "Error", // กรณีที่เกิดข้อผิดพลาดในการดึงข้อมูล
            };
          }
        }));

        setTransactionsById(transactionsWithStatus);

      }
    } catch (error) {
      message.error("Failed to load transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to fetch transactions when the component is mounted
  useEffect(() => {
    fetchGetTransactionsById();
  }, []);

  return (
    <div className="bg-white-600 flex justify-center items-center w-full">
      <div className="ant-card-body flex flex-col w-full max-w-5xl p-6 rounded shadow-lg">
        <div className="flex-1 p-6 max-w-full">
          {isLoading ? (
            <p className="text-center text-black dark:text-black">Loading...</p>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-black uppercase bg-shoppo dark:bg-shoppoo1 dark:text-black">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                  <th scope="col" className="px-6 py-3">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionsById.length > 0 ? (
                  transactionsById.map((transaction) => (
                    <tr
                      key={transaction.ID}
                      className="bg-white border-b text-black border-black dark:bg-white "
                    >
                      <td className="px-6 py-4">
                        {transaction.History ? format(new Date(transaction.History), 'yyyy-MM-dd HH:mm:ss') : "N/A"} {/* Format Date */}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.Amount ? transaction.Amount.toFixed(2) : "0.00"} {/* Format Amount */}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.PaymentStatus || "N/A"} {/* Display Payment Status */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No transactions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
