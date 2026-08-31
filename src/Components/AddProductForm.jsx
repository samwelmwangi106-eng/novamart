import { useState, useEffect } from "react";
import {
  FaBox,
  FaTag,
  FaDollarSign,
  FaBoxes,
  FaImage,
} from "react-icons/fa";

function AddProductForm({
  onAddProduct,
  onCancel,
  initialProduct,
}) {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

 
  // Load product when editing
 

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || "");
      setCategory(
        initialProduct.category || "Electronics"
      );
      setPrice(
        initialProduct.price !== undefined
          ? String(initialProduct.price)
          : ""
      );
      setStock(
        initialProduct.stock !== undefined
          ? String(initialProduct.stock)
          : ""
      );
      setImage(initialProduct.image || "");
    } else {
      setName("");
      setCategory("Electronics");
      setPrice("");
      setStock("");
      setImage("");
    }
  }, [initialProduct]);

 
  // Submit
 

  function handleSubmit(event) {
    event.preventDefault();

    // Basic validation
    if (!name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    const productData = {
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      image: image.trim(),
    };

    // Preserve ID when editing
    if (isEditing) {
      productData.id = initialProduct.id;
    }

    onAddProduct(productData);
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Product Name */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Product Name
        </label>

        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaBox className="text-muted" />
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="e.g. iPhone 15 Pro"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Category
        </label>

        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaTag className="text-muted" />
          </span>

          <select
            className="form-select"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="Electronics">
              Electronics
            </option>

            <option value="Fashion">
              Fashion
            </option>

            <option value="Liquor">
              Liquor
            </option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Price
        </label>

        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaDollarSign className="text-muted" />
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            placeholder="0.00"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
          />
        </div>
      </div>

      {/* Stock */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Stock Quantity
        </label>

        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaBoxes className="text-muted" />
          </span>

          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="e.g. 25"
            value={stock}
            onChange={(event) =>
              setStock(event.target.value)
            }
          />
        </div>
      </div>

      {/* Image URL */}
      <div className="mb-4">
        <label className="form-label fw-semibold">
          Product Image URL
        </label>

        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaImage className="text-muted" />
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="/images/product.jpg"
            value={image}
            onChange={(event) =>
              setImage(event.target.value)
            }
          />
        </div>

        <small className="text-muted">
          Enter the path or URL of the product image.
        </small>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2">

        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary px-4"
        >
          {isEditing
            ? "Update Product"
            : "Add Product"}
        </button>

      </div>

    </form>
  );
}

export default AddProductForm;