import { useState } from "react";

import AdminLayout from "../Layouts/AdminLayout";
import DashboardCard from "../Components/DashboardCard";
import StatCard from "../Components/StatCard";
import RecentOrders from "../Components/RecentOrders";

import productsData from "../Data/products.json";
import orders from "../Data/orders.json";
import users from "../Data/users.json";

import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";

function Dashboard() {
  // Load products from Local Storage if available
  const [products] = useState(() => {
    const savedProducts = localStorage.getItem("products");

    return savedProducts
      ? JSON.parse(savedProducts)
      : productsData;
  });

  // Dashboard Statistics
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  const lowStockProducts = products.filter(
    (product) => product.stock < 5
  ).length;

  return (
    <AdminLayout>
      <h2 className="mb-4">Dashboard</h2>

      {/* Main Statistics */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <StatCard
            title="Products"
            value={products.length}
            icon={<FaBox />}
            bgColor="bg-primary"
          />
        </div>

        <div className="col-md-3">
          <StatCard
            title="Orders"
            value={orders.length}
            icon={<FaShoppingCart />}
            bgColor="bg-success"
          />
        </div>

        <div className="col-md-3">
          <StatCard
            title="Customers"
            value={users.length}
            icon={<FaUsers />}
            bgColor="bg-warning"
          />
        </div>

        <div className="col-md-3">
          <StatCard
            title="Revenue"
            value="$4,500"
            icon={<FaDollarSign />}
            bgColor="bg-danger"
          />
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="row mb-5">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          color="primary"
        />

        <DashboardCard
          title="Total Stock"
          value={totalStock}
          color="success"
        />

        <DashboardCard
          title="Inventory Value"
          value={`$${inventoryValue}`}
          color="warning"
        />

        <DashboardCard
          title="Low Stock"
          value={lowStockProducts}
          color="danger"
        />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </AdminLayout>
  );
}

export default Dashboard;