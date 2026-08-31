import {
  FaSearch,
  FaFilter,
} from "react-icons/fa";

function OrderToolbar({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-3">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          {/* Search */}
          <div
            className="input-group"
            style={{
              maxWidth: "500px",
              flex: "1",
            }}
          >
            <span className="input-group-text bg-light border-end-0">
              <FaSearch className="text-muted" />
            </span>

            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search customer or product..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {/* Status Filter */}
          <div
            className="input-group"
            style={{
              width: "230px",
            }}
          >
            <span className="input-group-text bg-light border-end-0">
              <FaFilter className="text-muted" />
            </span>

            <select
              className="form-select bg-light border-start-0"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="All">
                All Orders
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderToolbar;