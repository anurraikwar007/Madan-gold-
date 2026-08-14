import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminProducts from "../components/admin/AdminProducts";
import AdminCategories from "../components/admin/AdminCategories";
import AdminCoupons from "../components/admin/AdminCoupons";
import AdminOrders from "../components/admin/AdminOrders";

export default function Admin() {
  return (
    <ProtectedRoute adminOnly>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="categories"
            element={<AdminCategories />}
          />

          <Route
            path="coupons"
            element={<AdminCoupons />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
            path="dashboard"
            element={
              <Navigate
                to="/admin"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/admin"
                replace
              />
            }
          />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}