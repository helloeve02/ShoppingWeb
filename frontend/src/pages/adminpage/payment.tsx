import React, { useEffect, useState } from 'react';
import { ListPayment, UpdatePaymentStatusCancel, UpdatePaymentStatusVerify, CreateTransection, CreateTransectionCancel } from '../../services/https'; // ฟังก์ชัน UpdatePaymentStatus
import { Table, message, Spin } from 'antd';
import { PaymentInterface } from '../../interfaces/IPayment';
// import { TransectionInterface } from '../../interfaces/ITransaction';

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<PaymentInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await ListPayment();
      // console.log('API Response:', response); // ตรวจสอบ API response
      // console.log('Payment Data:', response.data); // ตรวจสอบข้อมูลที่ได้รับ

      if (response.status === 200) {
        setPayments(response.data);
      }
    } catch (error) {
      // console.error('Fetch Error:', error);
      message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (record: PaymentInterface) => {
    const paymentId: number = Number(record.id);  // แปลง record.id เป็น number
    const payload = {
      Amount: record.amount,  // Amount from the payment record
      History: new Date(),  // Current date and time
      UserID: record.user_id,  // User ID from the transaction record
      PaymentID: record.id,  // Payment ID from the payment related to the transaction

    };
    setLoading(true); // ตั้งค่าให้แสดง spin ระหว่างที่กำลังทำการอัปเดตสถานะ
    try {
      const response = await UpdatePaymentStatusVerify(paymentId); // ใช้ paymentId ในการอัปเดตสถานะ
      if (response) {
        setPayments(prevPayments =>
          prevPayments.map(payment =>
            payment.id === paymentId ? { ...payment, status: 3 } : payment
          )
        );
        CreateTransection(payload);
        message.success('การยืนยันสำเร็จ');
        fetchPayments();
      } else {
        message.error('ไม่สามารถยืนยันการชำระเงินได้');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการยืนยัน');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (record: PaymentInterface) => {
    const paymentId: number = Number(record.id);

    const payload = {
      Amount: record.amount,  // Amount from the payment record
      History: new Date(),  // Current date and time
      UserID: record.user_id,  // User ID from the transaction record
      PaymentID: record.id,  // Payment ID from the payment related to the transaction

    };

    setLoading(true);
    try {
      const response = await UpdatePaymentStatusCancel(paymentId);
      if (response) {
        setPayments(prevPayments =>
          prevPayments.map(payment =>
            payment.id === paymentId ? { ...payment, status: 2 } : payment
          )
        );
        CreateTransectionCancel(payload);
        message.success('การยกเลิกสำเร็จ');
        fetchPayments();
      } else {
        console.error('Error Status:', response?.status);
        message.error('ไม่สามารถยกเลิกการชำระเงินได้');
      }
    } catch (error) {
      console.error('Reject Error:', error);
      message.error('เกิดข้อผิดพลาดในการยกเลิก');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchPayments();
  }, []);

  return loading ? (
    <Spin size="large" />
  ) : (
    <Table
      dataSource={payments}
      rowKey="id"  // ใช้ 'id' แทน 'ID'
      columns={[
        { title: 'ลำดับ', dataIndex: 'id' },  // ใช้ 'id' แทน 'ID'
        { title: 'ชื่อ', dataIndex: 'PayerName' },
        { title: 'จำนวนเงิน', dataIndex: 'amount' },
        {
          title: 'หลักฐาน',
          dataIndex: 'PaymentImage',
          render: (proof) => (
            <a href={proof} target="_blank" rel="noopener noreferrer">ดูหลักฐาน</a>
          )
        },
        {
          title: 'ยืนยัน',
          render: (_, record) => (
            <div>
              <button onClick={() => handleApprove(record)} style={{ color: 'green' }}>Verify</button>
              <button onClick={() => handleReject(record)} style={{ marginLeft: 8, color: 'red' }}>Cancel</button>
              {/* <button onClick={() => transectionDataFunc(record)} style={{ marginLeft: 8 }}>Create Transaction</button> */}
            </div>
          )
        }
      ]}
    />
  );
};

export default PaymentList;
