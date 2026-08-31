import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import React from "react";

function Topbar() {
  return (
    <nav className="navbar bg-white shadow-sm px-4 py-3">
      <div className="container-fluid">

        {/* Left Side */}
        <div className="d-flex align-items-center gap-3">

          <div>
            <h5 className="mb-0 fw-semibold">
              Admin Dashboard
            </h5>

            <small className="text-muted">
              Manage your NovaMart store
            </small>
          </div>

        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-4">

          {/* Search */}
          <div
            className="input-group d-none d-md-flex"
            style={{ width: "250px" }}
          >
            <span className="input-group-text bg-light border-0">
              <FaSearch className="text-muted" />
            </span>

            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="Search..."
            />
          </div>

          {/* Notifications */}
          <button
            className="btn btn-light position-relative"
            title="Notifications"
          >
            <FaBell />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "9px" }}
            >
              0
            </span>
          </button>

          {/* Admin Profile */}
          <div className="d-flex align-items-center gap-2">

            <FaUserCircle
              size={35}
              className="text-primary"
            />

            <div className="d-none d-sm-block">
              <div className="fw-semibold">
                Admin
              </div>

              <small className="text-muted">
                Administrator
              </small>
            </div>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Topbar;