import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import AdminLayout from "../Layout/AdminLayout";

const AdminMailBox = Loadable(lazy(() => import("../pages/adminpage/mailbox")));
const ArticlePage = Loadable(lazy(() => import("../pages/adminpage/article")));
const AdminReturn = Loadable(lazy(() => import("../pages/adminpage/return")));
const AdminPayment = Loadable(lazy(() => import("../pages/adminpage/payment")));

const AdminRoutes = (isLoggedIn: boolean) => {
  return isLoggedIn ? (
    <Route path="/">
      <Route element={<AdminLayout />}>
        <Route path="mailboxes" element={<AdminMailBox ID={0} />} />
        <Route path="article" element={<ArticlePage />} />
        <Route path="return" element={<AdminReturn />} />
        <Route path="payments" element={<AdminPayment />} />
      </Route>
    </Route>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoutes;
