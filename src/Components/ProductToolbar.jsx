function ProductToolbar({ search, setSearch, category, setCategory,sortBy, setSortBy, openModal }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div className="d-flex gap-3 flex-wrap">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: "300px" }}
        />

        <select
          className="form-select"
          style={{ width: "200px" }}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Liquor</option>
        </select>
      </div>
      <div className="col-md-3">
        <select className="form-select"
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
        >
        <option >Newest</option>
         <option >Name A-Z</option>
          <option >Name Z-A</option>
           <option >Price Low-High</option>
            <option >Price High-Low</option>
            <option >Highest Stock</option>
            <option >Lowest Stock</option>

        </select>

      </div>

      <button className="btn btn-primary" onClick={openModal}>
        + Add Product
      </button>
    </div>
  );
}

export default ProductToolbar
