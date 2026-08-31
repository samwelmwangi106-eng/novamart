import React from "react";

function StatCard({ title, value, icon, bgColor }) {
  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
    >
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center">

          {/* Information */}
          <div>
            <p className="text-muted mb-2 fw-medium">
              {title}
            </p>

            <h3 className="fw-bold mb-0">
              {value}
            </h3>
          </div>

          {/* Icon */}
          <div
            className={`${bgColor} text-white rounded-circle d-flex justify-content-center align-items-center shadow-sm`}
            style={{
              width: "58px",
              height: "58px",
              fontSize: "22px",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

        </div>

      </div>
    </div>
  );
}

export default StatCard;