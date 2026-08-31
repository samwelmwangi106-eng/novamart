import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaPlus,
} from "react-icons/fa";

function ProductToolbar({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
  openModal,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          {/* Left side - Search and Filters */}
          <div className="d-flex align-items-center gap-2 flex-wrap">

            {/* Search */}
            <div
              className="input-group"
              style={{ width: "300px" }}
            >
              <span className="input-group-text bg-light border-end-0">
                <FaSearch className="text-muted" />
              </span>

              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search products..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            {/* Category */}
            <div
              className="input-group"
              style={{ width: "210px" }}
            >
              <span className="input-group-text bg-light border-end-0">
                <FaFilter className="text-muted" />
              </span>

              <select
                className="form-select bg-light border-start-0"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Liquor</option>
              </select>
            </div>

            {/* Sort */}
            <div
              className="input-group"
              style={{ width: "210px" }}
            >
              <span className="input-group-text bg-light border-end-0">
                <FaSortAmountDown className="text-muted" />
              </span>

              <select
                className="form-select bg-light border-start-0"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="Newest">
                  Newest
                </option>

                <option value="Name A-Z">
                  Name A-Z
                </option>

                <option value="Name Z-A">
                  Name Z-A
                </option>

                <option value="Price Low-High">
                  Price Low-High
                </option>

                <option value="Price High-Low">
                  Price High-Low
                </option>

                <option value="Highest Stock">
                  Highest Stock
                </option>

                <option value="Lowest Stock">
                  Lowest Stock
                </option>
              </select>
            </div>

          </div>

          {/* Add Product */}
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={openModal}
          >
            <FaPlus />
            Add Product
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductToolbar;