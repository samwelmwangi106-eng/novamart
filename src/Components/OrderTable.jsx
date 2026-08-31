import StatusBadge from "./StatusBadge";
import {
  FaEye,
  FaEdit,
  FaShoppingCart,
} from "react-icons/fa";

function OrderTable({
  orders,
  onView,
  onChangeStatus,
}) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">

            {/* Header */}
            <thead className="table-dark">
              <tr>
                <th className="px-3 py-3">
                  Order ID
                </th>

                <th className="py-3">
                  Customer
                </th>

                <th className="py-3">
                  Product
                </th>

                <th className="py-3">
                  Status
                </th>

                <th className="py-3">
                  Total
                </th>

                <th className="py-3">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>

              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-muted py-5"
                  >
                    <FaShoppingCart
                      size={35}
                      className="mb-3"
                    />

                    <div className="fw-semibold">
                      No orders found
                    </div>

                    <small>
                      Try changing your search
                      or status filter.
                    </small>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>

                    {/* ID */}
                    <td className="px-3">
                      <span className="fw-semibold">
                        #{order.id}
                      </span>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="fw-semibold">
                        {order.customer}
                      </div>
                    </td>

                    {/* Product */}
                    <td>
                      <span className="text-muted">
                        {order.product}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge
                        status={order.status}
                      />
                    </td>

                    {/* Total */}
                    <td>
                      <span className="fw-bold text-success">
                        $
                        {Number(
                          order.total
                        ).toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="d-flex gap-2">

                        {/* View */}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          title="View Order"
                          onClick={() =>
                            onView &&
                            onView(order)
                          }
                        >
                          <FaEye />
                        </button>

                        {/* Change Status */}
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm"
                          title="Change Status"
                          onClick={() =>
                            onChangeStatus &&
                            onChangeStatus(order)
                          }
                        >
                          <FaEdit />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

export default OrderTable;