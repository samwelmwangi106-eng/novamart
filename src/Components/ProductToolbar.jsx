function ProductToolbar({ search, setSearch, category, setCategory, openModal }) {
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

      <button className="btn btn-primary" onClick={openModal}>
        + Add Product
      </button>
    </div>
  );
}

export default ProductToolbar
