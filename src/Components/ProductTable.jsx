import { FaEdit, FaTrash } from "react-icons/fa";
function ProductTable({
  search,
  category,
  products,
  onEdit,
  onDelete,
}) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <table className="table table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>Image</th>
          <th>ID</th>
         <th>Product</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredProducts.length === 0 ? (
          <tr>
            <td colSpan="8" className="text-center text-muted py-4">
              No products found.
            </td>
          </tr>
        ) : (
          filteredProducts.map((product) => {

            // Stock Status
            const status =
              product.stock === 0
                ? "Out of Stock"
                : product.stock <= 5
                ? "Critical"
                : product.stock <= 10
                ? "Low Stock"
                : "In Stock";

            const badgeColor =
              product.stock === 0
                ? "dark"
                : product.stock <= 5
                ? "danger"
                : product.stock <= 10
                ? "warning"
                : "success";

            return (
              <tr key={product.id}>
                {/* Image */}
                <td>
                  <img
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    className="product-image"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      border: "1px solid #dee2e6",
                      transition: "0.3s"
                    }}
                  />
                </td>

                {/* ID */}
                <td>{product.id}</td>

               {/* {name} */}
               <td>
                <div className="fw-bold">
                  {product.name}

                </div>
                {/* {category} */}
                <small className="text-muted">
                  {product.category}

                </small>
               </td>
                {/* Price */}
                <td className="fw-bold tect-success">${Number(product.price).toLocaleString()}</td>

                {/* Stock */}
                <td>
                  <span
                    className={`badge bg-${badgeColor}`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`badge bg-${badgeColor}`}
                  >
                    {status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => onEdit(product)}
>
  <FaEdit className="me-1" />
  Edit
</button>

<button
  className="btn btn-danger btn-sm"
  onClick={() => onDelete(product)}
>
  <FaTrash className="me-1" />
  Delete
</button>
                </td>
              </tr>
            );

          })
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;