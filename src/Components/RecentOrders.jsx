import orders from "../Data/orders.json"

import React from 'react'

function RecentOrders() {
    function getStatusBadge(status) {
  switch (status) {
    case "Delivered":
      return "badge bg-success";
    case "Pending":
      return "badge bg-warning text-dark";
    case "Processing":
      return "badge bg-primary";
    default:
      return "badge bg-secondary";
  }
}
  return (
    <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">

            <h4 className="mb-4">
                Recent Orders
            </h4>
            <table className="table table-hover">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (

              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>

                <td>

                  <span className={getStatusBadge(order.status)}>
                       {order.status}
                   </span>

                </td>

                <td>${order.total}</td>

              </tr>

            ))}

          </tbody>

        </table>
        </div>
      
    </div>
  )
}

export default RecentOrders
