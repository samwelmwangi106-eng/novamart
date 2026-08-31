import {
  FaShoppingCart,
  FaClock,
  FaCogs,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
} from "react-icons/fa";

function OrderAnalytics({ orders }) {
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  // Total revenue
  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );

  const analytics = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <FaShoppingCart />,
      color: "primary",
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: <FaClock />,
      color: "warning",
    },
    {
      title: "Processing",
      value: processingOrders,
      icon: <FaCogs />,
      color: "primary",
    },
    {
      title: "Shipped",
      value: shippedOrders,
      icon: <FaTruck />,
      color: "info",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: <FaCheckCircle />,
      color: "success",
    },
    {
      title: "Cancelled",
      value: cancelledOrders,
      icon: <FaTimesCircle />,
      color: "danger",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "success",
    },
  ];

  return (
    <div className="mb-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            Order Analytics
          </h4>

          <small className="text-muted">
            Overview of your order activity
          </small>
        </div>
      </div>

      <div className="row g-3">

        {analytics.map((item) => (
          <div
            className="col-6 col-md-4 col-lg"
            key={item.title}
          >
            <div className="card border-0 shadow-sm h-100">

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-start">

                  {/* Text */}
                  <div>
                    <small className="text-muted">
                      {item.title}
                    </small>

                    <h3
                      className={`text-${item.color} fw-bold mt-2 mb-0`}
                    >
                      {item.value}
                    </h3>
                  </div>

                  {/* Icon */}
                  <div
                    className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: "42px",
                      height: "42px",
                    }}
                  >
                    {item.icon}
                  </div>

                </div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default OrderAnalytics;