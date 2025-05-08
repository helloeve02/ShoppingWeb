import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import { ProductInterface } from "../../interfaces/Product";
// import { ProductImageInterface } from "../../interfaces/ProductImage";
// import { PaymentInterface } from "../../interfaces/IPayment";
import { PromotionInterface } from "../../interfaces/Promotion"
import { OrderInterface, OrderitemInterface, CartitemInterface } from "../../interfaces/IOrder";
// import {CartitemInterface, OrderInterface, OrderitemInterface, OrderstatusInterface, PaymentInterface, ProductInterface, ShippingInterface, ShippingstatusInterface} from "../../interfaces/IOrder"
// import { message } from "antd";
import { PasswordInterface } from "../../interfaces/Password"
import axios from "axios";
import {
  ArticlesInterface,
  HelpCenterInterface,
} from "../../interfaces/IHelpCenter";
import { ReviewInterface } from "../../interfaces/IReview";
import { ReturnInterface } from "../../interfaces/Return";
import { InvoiceInterface } from "../../interfaces/Invoice";
import { AddressInterface } from "../../interfaces/Address";
import { TransectionInterface } from "../../interfaces/ITransaction";
// import { Payment} from "../../pages/payment";
// import {WalletsInterface} from "../../interfaces/IWallets"
// const apiUrl = "https://api.shoppo.site"; 
const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,
  },
};
//==================================ไม่ใด้ใช้งาน======================================⏬
async function GetUsers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/users`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

async function GetGender() {
  return await axios
    .get(`${apiUrl}/genders`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
//==================================ไม่ใด้ใช้งาน======================================⏫
// const onFinish = async (values: SignInInterface) => {
//   console.log('Form Data:', values); // log the data being sent
//   let res = await SignIn(values);

//   if (res.status === 200) {
//     console.log('Login successful:', res.data);
//   } else {
//     console.error('Login failed:', res.data.error);
//     message.error(res.data.error || 'Login failed');
//   }
// };

//==================================Login======================================⏬
async function SignIn(data: SignInInterface) {
  return await axios

    .post(`${apiUrl}/signin`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}
//signus
async function CreateUser(data: UsersInterface) {
  return await axios

    .post(`${apiUrl}/signup`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}
// ResetPassword
async function ResetPassword(data: UsersInterface) {
  return await axios

    .put(`${apiUrl}/ResetPasswordUser`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

//==================================Login======================================⏫

//=====================================================User===================================================
// get User by id
async function GetUserById(id: string) {
  return await axios

    .get(`${apiUrl}/users/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}
async function DeleteUserByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  let res = await fetch(`${apiUrl}/users/${id}`, requestOptions).then((res) => {
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  });

  return res;
}
// update user
async function UpdateUserByid(id: string, data: UsersInterface) {
  return await axios

    .put(`${apiUrl}/users/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

//ไม่ได้ใช้
async function UpdateUser(data: UsersInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/users`, requestOptions).then((res) => {
    if (res.status == 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

//////////////////////////////////cart/////////////////////////////////////////////////////////////
async function GetCartById(id: string) {
  try {
    const res = await axios.get(`${apiUrl}/cartitem/${id}`, requestOptions);
    return res;
  } catch (error: any) {
    return error.response || { status: 500, message: "Unknown Error" };
  }
}


async function DeleteCartByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
  };

  let res = await fetch(`${apiUrl}/cartitem/${id}`, requestOptions).then(
    (res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    }
  );

  return res;
}

async function GetCartItems() {
  return await axios
    .get(`${apiUrl}/cartitem`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetShipping() {
  return await axios
    .get(`${apiUrl}/shipping`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

const CreateOrder = async (data: OrderInterface) => {
  try {
    const response = await axios.post(`${apiUrl}/order`, data, requestOptions);
    return response;
  } catch (error: any) {
    return error.response; // ส่งข้อมูล response เมื่อเกิดข้อผิดพลาด
  }
};

const CreateOrderItem = async (data: OrderitemInterface[]) => {
  try {
    const response = await axios.post(
      `${apiUrl}/orderitem`,
      data,
      requestOptions
    );
    return response;
  } catch (error: any) {
    return error.response; // ส่งข้อมูล response เมื่อเกิดข้อผิดพลาด
  }
};

//////////////////////////product////////////////////////////////////////////

async function CreateProduct(data: ProductInterface) {
  return await axios
    .post(`${apiUrl}/products`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetProducts() {
  return await axios
    .get(`${apiUrl}/products`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetProductByUserID(id: string) {
  return await axios
    .get(`${apiUrl}/products/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetProductByID(id: string) {
  return await axios
    .get(`${apiUrl}/products/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateProduct(id: string, data: ProductInterface) {
  return await axios
    .patch(`${apiUrl}/products/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteProduct(id: string) {
  return await axios
    .delete(`${apiUrl}/products/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllPromotion() {
  return await axios
    .get(`${apiUrl}/promotions`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPromotionByID(id: string) {
  return await axios
    .get(`${apiUrl}/promotions/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdatePromotion(id: string, data: ProductInterface) {
  return await axios
    .patch(`${apiUrl}/promotions/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreatePromotion(data: PromotionInterface) {
  return await axios
    .post(`${apiUrl}/promotions`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeletePromotion(id: string) {
  return await axios
    .delete(`${apiUrl}/promotions/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCategories() {
  return await axios
    .get(`${apiUrl}/categories`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetBrand() {
  return await axios
    .get(`${apiUrl}/brands`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetProductStatus() {
  return await axios
    .get(`${apiUrl}/product_status`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetPromotionStatus() {
  return await axios
    .get(`${apiUrl}/promotion_status`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Orders
async function GetOrderItemsByUserID(id: string) {
  return await axios
    .get(`${apiUrl}/orders/item/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function RecievedOrder(id: string | undefined) {
  return await axios
    .patch(`${apiUrl}/orders-recieved/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function ReturnOrder(id: string | undefined) {
  return await axios
    .patch(`${apiUrl}/return-order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function UpdateWalletByUserID(id: string | undefined, totalPrice: string | undefined) {
  return await axios
    .patch(`${apiUrl}/wallet/user/${id}/${totalPrice}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetShopNameByUserID(id: string) {
  return await axios
    .get(`${apiUrl}/user/shop-name/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Return
async function CreateReturn(data: ReturnInterface) {
  return await axios
    .post(`${apiUrl}/return`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetReturnRequest() {
  return await axios
    .get(`${apiUrl}/return-request`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetReturnManaged() {
  return await axios
    .get(`${apiUrl}/return-managed`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetReturnApproved(id: string) {
  return await axios
    .get(`${apiUrl}/return-approved/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetReturnRefunded(id: string) {
  return await axios
    .get(`${apiUrl}/return-refunded/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function ApproveReturn(id: string | undefined) {
  return await axios
    .patch(`${apiUrl}/return-approve/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function RefundReturn(id: string | undefined) {
  return await axios
    .patch(`${apiUrl}/return-refund/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function DenyReturn(id: string | undefined) {
  return await axios
    .patch(`${apiUrl}/return-deny/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetReturnTypes() {
  return await axios
    .get(`${apiUrl}/return-type`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetReturnReasons() {
  return await axios
    .get(`${apiUrl}/return-reason`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// Invoice
async function CreateInvoice(data: InvoiceInterface) {
  return await axios
    .post(`${apiUrl}/invoice`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetInvoiceTypes() {
  return await axios
    .get(`${apiUrl}/invoice-type`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetInvoiceByUserID(id: string | null) {
  return await axios
    .get(`${apiUrl}/invoice/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetInvoiceByOrderID(id: string | null) {
  return await axios
    .get(`${apiUrl}/invoice/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function UpdateOrderIDForInvoice(id: string | undefined, orderID: string | undefined) {
  return await axios
    .patch(`${apiUrl}/invoice-update-orderID/${id}/${orderID}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function DeleteInvoiceByID(id: string | undefined) {
  return await axios
    .delete(`${apiUrl}/invoice/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


//============================================HelpCenter=============================================
async function CreateHelpCenterForm(data: HelpCenterInterface) {
  return await axios
    .post(`${apiUrl}/create-helpcenterform`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ListMailBox() {
  return await axios
    .get(`${apiUrl}/list-mailbox`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ResponseMailBox(
  messageId: number,
  adminresponse: string,
  HelpCenterStatusID: number
) {
  const data = {
    messageId: messageId,
    response: adminresponse,
    helpcenterstatus_id: HelpCenterStatusID,
  };

  const res = await axios.post(
    `${apiUrl}/response-mailbox`,
    data,
    requestOptions
  );
  return res.data;
}

async function ListMailBoxStatus() {
  return await axios
    .get(`${apiUrl}/list-mailboxstatus`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ListArticles() {
  return await axios
    .get(`${apiUrl}/list-article`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function Createarticles(data: ArticlesInterface) {
  return await axios
    .post(`${apiUrl}/create-article`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateReadStatus(id: number) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
    },
    body: JSON.stringify({ is_read: true }),
  };

  try {
    const response = await fetch(
      `${apiUrl}/update-read-status/${id}`,
      requestOptions
    );
    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      console.error("Error 401: Unauthorized - ตรวจสอบ Token และการอนุญาต");
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
    return false;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}

async function GetTopics() {
  return await axios
    .get(`${apiUrl}/topics`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ListPayment() {
  return await axios
    .get(`${apiUrl}/payments`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreatePayment(data: FormData) {
  try {
    const response = await axios.post(`${apiUrl}/payment`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${Authorization}`,
      },
    });
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

async function GetPaymentByID(id: string) {
  try {
    const res = await axios.get(`${apiUrl}/payment/${id}`, requestOptions);
    return res;
  } catch (error: any) {
    return error.response || { status: 500, message: "Unknown Error" };
  }
}
async function UpdatePaymentStatusCancel(id: number) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`, // Make sure to use the correct token here
    },
    body: JSON.stringify({ payment_status_id: 2 }), // Update with the correct status
  };

  try {
    const response = await fetch(`${apiUrl}/payments/${id}/update-status-Cancel`, requestOptions); // Correct endpoint URL


    if (response.ok) {
      return await response.json();
      // console.log("Payment status updated successfully:", data);
      // return data; // Return response data if successful
    } else if (response.status === 401) {
      console.error("Unauthorized request. Please check your token.");
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
    return false;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}
async function UpdatePaymentStatusVerify(id: number) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`, // Make sure to use the correct token here
    },
    body: JSON.stringify({ payment_status_id: 3 }), // Update with the correct status
  };

  try {
    const response = await fetch(`${apiUrl}/payments/${id}/update-status-Verify`, requestOptions); // Correct endpoint URL


    if (response.ok) {
      const data = await response.json();
      return data
      // console.log("Payment status updated successfully:", data);
      // return data; // Return response data if successful
    } else if (response.status === 401) {
      console.error("Unauthorized request. Please check your token.");
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
    return false;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}


//============================================Review======================================

async function ListReviewProducts(productId: string) {
  if (!productId) {
    console.error("productId is required");
    return;
  }

  // ตรวจสอบว่า productId ถูกส่งไปใน URL หรือไม่
  return await axios
    .get(`${apiUrl}/list-reviewable-products/${productId}`, requestOptions)  // ส่ง productId ใน URL path
    .then((res) => res)
    .catch((e) => e.response);
}



async function ListUserReviews(id: string) {
  return await axios
    .get(`${apiUrl}/user-reviews/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateReview(data: ReviewInterface) {
  return await axios
    .post(`${apiUrl}/create-review`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ListOrderItemsNoReview(id: string) {
  return await axios
    .get(`${apiUrl}/list-orderitem-noreview/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//////////////////////////////////address/////////////////////////////////////////////////////////////
async function GetAddress(id: string) {
  try {
    const res = await axios.get(`${apiUrl}/address/${id}`, requestOptions);
    return res;
  } catch (error: any) {
    return error.response || { status: 500, message: "Unknown Error" };
  }
}
async function GetAddressType() {
  return await axios
    .get(`${apiUrl}/types`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateAddress(data: AddressInterface) {
  return await axios
    .post(`${apiUrl}/address`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAddressById(id: string) {
  return await axios
    .get(`${apiUrl}/address/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function DeleteAddress(id: any) {
  return await axios
    .delete(`${apiUrl}/address/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


// update
async function UpdateAddress(id: string, data: AddressInterface) {
  return await axios
    .put(`${apiUrl}/address/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


async function FavoriteToggle(productId: number, reviewId: number, userId: number, action: string) {
  if (isNaN(userId)) {
    console.error("Invalid user_id provided.");
    return false;
  }

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Authorization}`,
    },
  };

  try {
    const url = `${apiUrl}/favorite-toggle/${productId}/${reviewId}/${userId}/${action}`;
    const response = await fetch(url, requestOptions);

    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
    return false;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
}

async function DeleteCartitem(id: Number) {
  return await axios
    .delete(`${apiUrl}/cartitem/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateCart(id: number, quantity: number) {
  const payload = { Quantity: quantity }; // Create an object with the quantity

  return await axios
    .patch(`${apiUrl}/cartitem/${id}`, payload, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function CreateCart(data: CartitemInterface) {
  return await axios
    .post(`${apiUrl}/cartitem`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

//////////////////////////////////////
async function GetTransection(id: string) {
  try {
    const res = await axios.get(`${apiUrl}/transaction/${id}`, requestOptions);
    return res;
  } catch (error: any) {
    return error.response || { status: 500, message: "Unknown Error" };
  }
}
async function GetTransectionById(id: string) {
  return await axios
    .get(`${apiUrl}/transaction/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function CreateTransection(data: TransectionInterface) {
  return await axios
    .post(`${apiUrl}/transaction`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function CreateTransectionCancel(data: TransectionInterface) {
  return await axios
    .post(`${apiUrl}/transactions`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}
async function GetWalletByID(id: string | undefined) {
  try {
    const res = await axios.get(`${apiUrl}/wallet/${id}`, requestOptions);
    return res;
  } catch (error: any) {
    return error.response || { status: 500, message: "Unknown Error" };
  }
}
async function GetPaymentStatusById(id: string) {
  return await axios
    .get(`${apiUrl}/paymentstatus/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function DeleteSelectedCartItems(userid: string, id: number) {
  return await axios
    .delete(`${apiUrl}/cartitem/${userid}/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAddressByAddressId(id: string) {
  return await axios
    .get(`${apiUrl}/addressByid/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);

}

async function UpdateArticle(id: string, data: ArticlesInterface) {
  return await axios
    .put(`${apiUrl}/articles/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteArticle(id: Number | undefined) {
  return await axios
    .delete(`${apiUrl}/articles/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetOrderByID(id: string | undefined) {
  return await axios
    .get(`${apiUrl}/order/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateWalletByID(id: string, balance: number) {
  const payload = { Balance: balance };
  return await axios
    .patch(`${apiUrl}/wallet/${id}`, payload, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function ChangePassword(id: number, data: PasswordInterface): Promise<any> {
  try {
    const url = `${apiUrl}/ChangePassword/${id}`;
    const response = await axios.patch(url, data, requestOptions);
    return response;
  } catch (error: any) {
    console.error("API Error:", error);
    return error.response;
  }
}

async function GetNotification() {
  return await axios
    .get(`${apiUrl}/notifications`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  CreateTransectionCancel,
  GetPaymentStatusById,
  GetWalletByID,
  CreateTransection,
  UpdatePaymentStatusCancel,
  UpdatePaymentStatusVerify,
  GetTransectionById,
  GetTransection,
  ListPayment,
  CreatePayment,
  GetPaymentByID,
  GetUsers,
  DeleteUserByID,
  UpdateUser,
  UpdateUserByid,
  SignIn, //sign in
  CreateUser, //sign Up
  GetUserById, // get User by id
  ResetPassword,
  GetCartById,
  DeleteCartByID,
  GetCartItems,
  CreateCart,
  CreateProduct,
  GetProducts,
  GetProductByID,
  GetProductByUserID,
  UpdateProduct,
  DeleteProduct,
  GetAllPromotion,
  GetPromotionByID,
  UpdatePromotion,
  CreatePromotion,
  DeletePromotion,
  GetCategories,
  GetBrand,
  GetProductStatus,
  GetPromotionStatus,
  // onFinish,
  GetTopics,
  CreateHelpCenterForm,
  ListMailBox,
  ResponseMailBox,
  ListMailBoxStatus,
  ListArticles,
  Createarticles,
  UpdateReadStatus,
  // DeleteMessageMailBox,

  // Orders
  GetOrderItemsByUserID,
  RecievedOrder,
  ReturnOrder,
  UpdateWalletByUserID,
  GetShopNameByUserID,

  // Return
  CreateReturn,
  GetReturnRequest,
  GetReturnManaged,
  ApproveReturn,
  DenyReturn,
  GetReturnTypes,
  GetReturnReasons,
  GetReturnApproved,
  GetReturnRefunded,
  RefundReturn,

  //Review
  ListUserReviews,
  CreateReview,
  ListOrderItemsNoReview,
  FavoriteToggle,
  ListReviewProducts,
  UpdateArticle,
  DeleteArticle,

  // Invoice
  CreateInvoice,
  GetInvoiceTypes,
  GetInvoiceByOrderID,
  GetInvoiceByUserID,
  UpdateOrderIDForInvoice,
  DeleteInvoiceByID,

  GetAddress,
  CreateOrder,
  CreateOrderItem,
  GetShipping,
  GetAddressType,
  CreateAddress,
  GetAddressById,
  DeleteAddress,
  UpdateAddress,
  GetGender,
  DeleteCartitem,
  UpdateCart,
  DeleteSelectedCartItems,
  GetAddressByAddressId,
  GetOrderByID,
  UpdateWalletByID,
  ChangePassword,
  GetNotification
}
