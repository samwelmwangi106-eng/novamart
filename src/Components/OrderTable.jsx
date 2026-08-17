import React from "react";
import StatusBadge from "./StatusBadge";

function OrderTable({
  orders,
  onView,
  onChangeStatus,
}) {
  return (
    <table className="table table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Status</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td
              colSpan="6"
              className="text-center py-4"
            >
              No orders found.
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>{order.customer}</td>

              <td>{order.product}</td>

              <td>
                <StatusBadge
                  status={order.status}
                />
              </td>

              <td>${order.total}</td>

              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() =>
                    onView(order)
                  }
                >
                  View
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() =>
                    onChangeStatus(order)
                  }
                >
                  Change Status
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default OrderTable;