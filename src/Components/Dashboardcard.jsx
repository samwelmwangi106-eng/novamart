import React from "react";

function DashboardCard({ title, value, color }) {
  return (
    <div className="col-md-3 mb-4">
      <div
        className={`card border-0 border-start border-4 border-${color} shadow-sm h-100`}
        style={{
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "default",
        }}
      >
        <div className="card-body p-4">

          <p className="text-muted mb-2 fw-medium">
            {title}
          </p>

          <h2 className={`text-${color} fw-bold mb-0`}>
            {value}
          </h2>

        </div>
      </div>
    </div>
  );
}

export default DashboardCard;