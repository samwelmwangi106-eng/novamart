function InventorySummary({
  totalProducts,
  totalCategories,
  totalStock,
  inventoryValue,
  lowStockProducts,
}) {
  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h4 className="mb-4">Inventory Overview</h4>

        <table className="table table-borderless">
          <tbody>
            <tr>
              <td>Total Products</td>
              <td className="fw-bold text-end">{totalProducts}</td>
            </tr>

            <tr>
              <td>Total Categories</td>
              <td className="fw-bold text-end">{totalCategories}</td>
            </tr>

            <tr>
              <td>Total Stock</td>
              <td className="fw-bold text-end">{totalStock}</td>
            </tr>

            <tr>
              <td>Inventory Value</td>
              <td className="fw-bold text-end">
                ${inventoryValue.toLocaleString()}
              </td>
            </tr>

            <tr>
              <td>Low Stock Products</td>
              <td className="fw-bold text-danger text-end">
                {lowStockProducts}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventorySummary;