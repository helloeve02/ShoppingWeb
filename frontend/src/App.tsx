import React from "react";
import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loadable from "./components/third-patry/Loadable";
// Layouts and Components
import Layout from "./Layout/FullLayout";
import Topbar from "./components/topbar";
import AdminRoutes from "./routes/AdminRoutes";
import RequestInvoice from "./pages/invoice/invoice";
import Orders from "./pages/orders/orders";
import SellerReturnPage from "./pages/sellercenter/return";
import SellerLayout from "./Layout/SellerLayout/sellerLayout";
import PrivateRoute from "./PrivateRoute";

// Pages
const LoginPage = Loadable(lazy(() => import("./pages/authentication/Login")));
const SignUp = Loadable(lazy(() => import("./pages/authentication/Register")));
const ForgetPassword = Loadable(lazy(() => import("./pages/authentication/Forgotpassword/forgotpassword")));
const Homepage = Loadable(lazy(() => import("./pages/home")));
const SellerCenter = Loadable(lazy(() => import("./pages/sellercenter/sellercenter")));
const NewSeller = Loadable(lazy(() => import("./pages/sellercenter/new_seller/new_seller")));
const SellerRegistration = Loadable(lazy(() => import("./pages/sellercenter/seller_register/seller_register")));
const CustomerReturn = Loadable(lazy(() => import("./pages/return/return")));
const Cart = Loadable(lazy(() => import("./pages/cartitem/cartitem")));
const Payment = Loadable(lazy(() => import("./pages/payment")));
const CreateProducts = Loadable(lazy(() => import("./pages/products/create")));
const CreatePromotions = Loadable(lazy(() => import("./pages/promotions/create")));
const EditPromotions = Loadable(lazy(() => import("./pages/promotions/edit")));
const UpdateProducts = Loadable(lazy(() => import("./pages/products/edit")));
const Order = Loadable(lazy(() => import("./pages/order/order")));
const HelpPages = Loadable(lazy(() => import("./pages/helpcenter/index")));
const MailBox = Loadable(lazy(() => import("./pages/mailbox/index")));
const ReviewPage = Loadable(lazy(() => import("./pages/review/index")));
const Profile = Loadable(lazy(() => import("./pages/profile/profile")));
const Address = Loadable(lazy(() => import("./pages/address/address")));
const Wallet = Loadable(lazy(() => import("./pages/address/wallet")));
const ProductPage = Loadable(lazy(() => import("./pages/products")));
const Transaction = Loadable(lazy(() => import("./pages/transection")));
const ReturnStatusPage = Loadable(lazy(() => import("./pages/return/return_status")));
const Search = Loadable(lazy(() => import("./pages/products/search_product/search")));
const ChangePassword = Loadable(lazy(() => import("./pages/profile/newpassword")));
const Notification = Loadable(lazy(() => import("./pages/notification/notification")));
const Orderes = Loadable(lazy(() => import("./pages/order/orderes")));
const isLoggedIn = localStorage.getItem("isLogin") === "true";
const role = localStorage.getItem("role");
const seller = localStorage.getItem("seller") === "true";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes with Topbar */}
        <Route
          path="/"
          element={
            <>
              <Topbar />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Topbar />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Topbar />
              <SignUp />
            </>
          }
        />
        <Route
          path="/forget-password"
          element={
            <>
              <Topbar />
              <ForgetPassword />
            </>
          }
        />

        {/* Authenticated User Routes */}
        <Route element={<Layout />}>
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Homepage /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/address/:id" element={<PrivateRoute><Address /></PrivateRoute>} />
          <Route path="/wallet/:id" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
          <Route path="/search/:searchQuery?" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/search/category/:categoryId" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/products/create" element={<PrivateRoute><CreateProducts /></PrivateRoute>} />
          <Route path="/products/edit/:id" element={<PrivateRoute><UpdateProducts /></PrivateRoute>} />
          <Route path="/promotions/create" element={<PrivateRoute><CreatePromotions /></PrivateRoute>} />
          <Route path="/promotions/edit/:id" element={<PrivateRoute><EditPromotions /></PrivateRoute>} />
          <Route path="/transaction" element={<PrivateRoute><Transaction /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/seller/return" element={<PrivateRoute><SellerReturnPage /></PrivateRoute>} />
          <Route path="/orders/return" element={<PrivateRoute><CustomerReturn /></PrivateRoute>} />
          <Route path="/orders/return-status" element={<PrivateRoute><ReturnStatusPage /></PrivateRoute>} />
          <Route path="/order/invoice" element={<PrivateRoute><RequestInvoice /></PrivateRoute>} />
          <Route path="/helpcenter" element={<PrivateRoute><HelpPages /></PrivateRoute>} />
          <Route path="/mailbox" element={<PrivateRoute><MailBox ID={0} /></PrivateRoute>} />
          <Route path="/orders/review" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
          <Route path="/password/:id" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/notifications/:id" element={<PrivateRoute><Notification /></PrivateRoute>} />
          <Route path="/orderes" element={<PrivateRoute><Orderes /></PrivateRoute>} />
        </Route>

        {/* Role-based Route for SellerCenter Notification*/}
        <Route
          path="/sellercenter"
          element={
            isLoggedIn && seller === true ? (
              <PrivateRoute>
                <SellerLayout />
                <SellerCenter />
              </PrivateRoute>
            ) : (
              <Navigate to="/sellercenter/newSeller" />
            )
          }
        />

        <Route
          path="/sellercenter/newSeller"
          element={<PrivateRoute><SellerLayout /><NewSeller /></PrivateRoute>}
        />

        <Route
          path="/sellercenter/register"
          element={<PrivateRoute><SellerLayout /><SellerRegistration /></PrivateRoute>}
        />

        {isLoggedIn && role === "Admin" && AdminRoutes(isLoggedIn)}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
