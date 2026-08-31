import React from "react";
import {
  FaBox,
  FaTags,
  FaWarehouse,
  FaDollarSign,
  FaExclamationTriangle,
} from "react-icons/fa";

function InventorySummary({
  totalProducts,
  totalCategories,
  totalStock,
  inventoryValue,
  lowStockProducts,
}) {
  const summaryItems = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: <FaBox />,
      color: "primary",
    },
    {
      label: "Total Categories",
      value: totalCategories,
      icon: <FaTags />,
      color: "info",
    },
    {
      label: "Total Stock",
      value: totalStock,
      icon: <FaWarehouse />,
      color: "success",
    },
    {
      label: "Inventory Value",
      value: `$${inventoryValue.toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "warning",
    },
    {
      label: "Low Stock Products",
      value: lowStockProducts,
      icon: <FaExclamationTriangle />,
      color: "danger",
    },
  ];

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body p-4">

        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1">
            Inventory Overview
          </h4>

          <p className="text-muted mb-0">
            Quick summary of your current inventory
          </p>
        </div>

        {/* Summary Items */}
        <div className="row g-3">

          {summaryItems.map((item) => (
            <div
              className="col-md-6 col-lg"
              key={item.label}
            >
              <div
                className={`border-start border-4 border-${item.color} bg-light rounded p-3 h-100`}
              >
                <div className="d-flex align-items-center gap-3">

                  {/* Icon */}
                  <div
                    className={`text-${item.color}`}
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Information */}
                  <div>
                    <small className="text-muted d-block">
                      {item.label}
                    </small>

                    <span className="fw-bold fs-5">
                      {item.value}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default InventorySummary;