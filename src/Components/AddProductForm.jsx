import { useState, useEffect } from "react";

function AddProductForm({ onAddProduct, onCancel, initialProduct }) {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (initialProduct) {
      setImage(initialProduct?.image || "");
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(String(initialProduct.price));
      setStock(String(initialProduct.stock));
    } else {
      setName("");
      setCategory("Electronics");
      setPrice("");
      setStock("");
      setImage("");
    }
  }, [initialProduct]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !price || !stock) {
      alert("Please fill in all fields.");
      return;
    }

    const productData = {
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      image,
    };

    if (isEditing) {
      productData.id = initialProduct.id;
    }

    onAddProduct(productData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Product Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Liquor</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-control"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input 
        type="text"
        className="form-control"
        placeholder="/images/product.jpg"
        value={image}
        onChange={(event) => setImage(event.target.value)}


        />

      </div>

      <div className="d-flex gap-2 justify-content-end">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

export default AddProductForm;
