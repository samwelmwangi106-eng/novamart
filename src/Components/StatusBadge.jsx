import React from 'react'

function StatusBadge({ status }) {
  let color = "secondary";

  if (status === "Pending") {
    color = "warning";
  } else if (status === "Processing") {
    color = "primary";
  } else if (status === "Delivered") {
    color = "success";
  } else if (status === "Cancelled") {
    color = "danger";
  }

  return (
    <span className={`badge bg-${color}`}>
      {status}
    </span>
  );
}
export default StatusBadge
