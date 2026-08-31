function StatusBadge({ status }) {
  const statusColors = {
    Pending: "warning",
    Processing: "primary",
    Shipped: "info",
    Delivered: "success",
    Cancelled: "danger",
  };

  const color = statusColors[status] || "secondary";

  return (
    <span
      className={`badge bg-${color} px-3 py-2`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;