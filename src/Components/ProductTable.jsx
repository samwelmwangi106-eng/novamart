function ProductTable({ search, category, products, onEdit, onDelete }) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <table className="table table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredProducts.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center text-muted py-4">
              No products found.
            </td>
          </tr>
        ) : (
          filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </button>
                <button
                   className="btn btn-danger btn-sm"
                   onClick={() => onDelete(product)}
                  >
                     Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;
