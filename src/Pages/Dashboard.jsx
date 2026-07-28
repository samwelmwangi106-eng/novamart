import AdminLayout from "../Layouts/AdminLayout";
import StatCard from "../Components/StatCard";
import products from "../data/products.json";
import orders from "../data/orders.json";
import users from "../data/users.json";
import RecentOrders from "../Components/RecentOrders";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaDollarSign
} from "react-icons/fa";
function Dashboard() {
  return (
    <AdminLayout>

      <h2 className="mb-4">Dashboard</h2>
<div className="row g-4">

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
    <div className="mt-5">
      <RecentOrders />

    </div>

  </div>

</AdminLayout>
  );
}

export default Dashboard;