import { useState, useEffect } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import OrderToolbar from "../Components/OrderToolbar";
import OrderTable from "../Components/OrderTable";
import OrderDetailsModal from "../Components/OrderDetailsModal";
import OrderAnalytics from "../Components/OrderAnalytics";
import Modal from "../Components/Modal";

import ordersData from "../Data/orders.json";

function Orders() {
 
  // State
 

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");

    return savedOrders
      ? JSON.parse(savedOrders)
      : ordersData;
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  // Separate modals
  const [viewOrder, setViewOrder] = useState(null);
  const [statusOrder, setStatusOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

 
  // Save to Local Storage
 

  useEffect(() => {
    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );
  }, [orders]);

 
// Search + Filter


const filteredOrders = orders.filter((order) => {
  const searchTerm = search
    .toLowerCase()
    .trim();

  const matchesSearch =
    String(order.customer || "")
      .toLowerCase()
      .includes(searchTerm) ||
    String(order.product || "")
      .toLowerCase()
      .includes(searchTerm) ||
    String(order.id || "")
      .includes(searchTerm) ||
    String(order.status || "")
      .toLowerCase()
      .includes(searchTerm);

  const matchesStatus =
    status === "All" ||
    order.status === status;

  return matchesSearch && matchesStatus;
});

 
  // Update Status
 

  function updateOrderStatus(orderId, newStatus) {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
          }
        : order
    );

    setOrders(updatedOrders);
  }

 
  // View Details Modal
 

  function openViewModal(order) {
    setViewOrder(order);
  }

  function closeViewModal() {
    setViewOrder(null);
  }

 
  // Status Modal
 

  function openStatusModal(order) {
    setStatusOrder(order);
    setSelectedStatus(order.status);
  }

  function closeStatusModal() {
    setStatusOrder(null);
    setSelectedStatus("");
  }

  function saveStatus() {
    updateOrderStatus(
      statusOrder.id,
      selectedStatus
    );

    closeStatusModal();
  }

  return (
    <AdminLayout>
      <h2 className="mb-4">Orders</h2>

      <OrderToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />
      <OrderAnalytics orders={orders} />

      <OrderTable
        orders={filteredOrders}
        onView={openViewModal}
        onChangeStatus={openStatusModal}
      />

      {/* View Order Modal */}

      {viewOrder && (
        <OrderDetailsModal
          order={viewOrder}
          onClose={closeViewModal}
        />
      )}

      {/* Change Status Modal */}

      {statusOrder && (
        <Modal
          title="Change Order Status"
          onClose={closeStatusModal}
        >
          <div className="mb-3">
            <label className="form-label">
              Select Status
            </label>

            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={closeStatusModal}
            >
              Cancel
            </button>

            <button
              className="btn btn-success"
              onClick={saveStatus}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

export default Orders;