import { useState, useEffect } from "react";
import ProductsChart from "../Components/ProductsChart";
import AdminLayout from "../Layouts/AdminLayout";
import DashboardCard from "../Components/DashboardCard";
import StatCard from "../Components/StatCard";
import RecentOrders from "../Components/RecentOrders";
import InventorySummary from "../Components/InventorySummary";
import OrderStatusChart from "../Components/OrderStatusChart";
import OrderAnalytics from "../Components/OrderAnalytics";
import productsData from "../Data/products.json";
import ordersData from "../Data/orders.json";
import users from "../Data/users.json";
import DashboardActions from "../Components/DashboardActions";
import { useNavigate } from "react-router-dom";

import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";

function Dashboard() {
  // Load products from Local Storage if available
  
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");

    return savedProducts ? JSON.parse(savedProducts): productsData;
  });
  useEffect(() => {
  const handleStorageChange = () => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

const [orders, setOrders] = useState(() => {
  const savedOrders = localStorage.getItem("orders");

  return savedOrders 
  ? JSON.parse(savedOrders)
  : ordersData;
});
useEffect(() => {
  const handleStorageChange = () => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };
  window.addEventListener(
    "storage",
    handleStorageChange
  );

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);
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
  const totalCategories = new Set(
  products.map((product) => product.category)
).size;
  
const navigate = useNavigate();

//Navigate to Products page 
function handleAddProduct(){
  navigate("/products")
}
// show low stock products
function handleLowStock(){
  navigate("/products?filter=low-stock");
}
// Reset inventory
function handleResetInventory() {
  const confirmed = window.confirm("Reset inventory to default products");

if (!confirmed) return;

localStorage.removeItem("products");
window.location.reload()
}
// Export inventory as CSV
function handleExportInventory(){
  const headers = [
    "ID",
    "Name",
    "Category",
    "Price",
    "Stock",
  ];
  const rows = products.map((product) => [
    product.id,
    product.name,
    product.category,
    product.price,
    product.stock,
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(","))
  ].join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "novamart-inventory.csv";

  link.click();

  URL.revokeObjectURL(url);
}
  return (
    <AdminLayout>
      <h2 className="mb-4">Dashboard</h2>
      <DashboardActions 
      onAddProduct={handleAddProduct}
      onLowStock={handleLowStock}
      onExport={handleExportInventory}
      onReset={handleResetInventory}
      />

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
      <InventorySummary
        totalProducts={totalProducts}
        totalCategories={totalCategories}
        totalStock={totalStock}
        inventoryValue={inventoryValue}
        lowStockProducts={lowStockProducts}
      />
      <OrderAnalytics orders={orders} />
      <OrderStatusChart orders={orders} />
      <div className="mt-4">
          <ProductsChart
          products={products}
          />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </AdminLayout>
  );
}

export default Dashboard;