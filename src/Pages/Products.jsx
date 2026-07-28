import { useState, useEffect } from "react";
import productsData from "../Data/products.json";

import AdminLayout from "../Layouts/AdminLayout";
import ProductToolbar from "../Components/ProductToolbar";
import ProductTable from "../Components/ProductTable";
import AddProductForm from "../Components/AddProductForm";
import Modal from "../Components/Modal";
import AlertMessage from "../Components/AlertMessage";
import Pagination from "../Components/Pagination";

function Products() {
  // ----------------------------
  // State
  // ----------------------------

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");

    return savedProducts
      ? JSON.parse(savedProducts)
      : productsData;
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [productToDelete, setProductToDelete] = useState(null);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 5;

  // ----------------------------
  // Local Storage
  // ----------------------------

  useEffect(() => {
    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );
  }, [products]);

  // ----------------------------
  // Reset page when searching
  // ----------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  // ----------------------------
  // Alert Helper
  // ----------------------------

  function showAlert(type, message) {
    setAlert({
      type,
      message,
    });

    setTimeout(() => {
      setAlert({
        type: "",
        message: "",
      });
    }, 3000);
  }

  // ----------------------------
  // Reset Inventory
  // ----------------------------

  function resetProducts() {
    localStorage.removeItem("products");

    setProducts(productsData);

    showAlert(
      "info",
      "Inventory has been reset."
    );
  }

  // ----------------------------
  // Modal Functions
  // ----------------------------

  function closeModal() {
    setShowModal(false);
    setEditingProduct(null);
  }

  function openAddModal() {
    setEditingProduct(null);
    setShowModal(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setShowModal(true);
  }

  function openDeleteModal(product) {
    setProductToDelete(product);
  }

  // ----------------------------
  // Save Product
  // ----------------------------

  function saveProduct(productData) {
    // Edit Product
    if (productData.id) {
      const updatedProducts = products.map(
        (product) =>
          product.id === productData.id
            ? {
                ...product,
                ...productData,
              }
            : product
      );

      setProducts(updatedProducts);

      showAlert(
        "success",
        "Product updated successfully."
      );

      closeModal();

      return;
    }

    // Duplicate Product
    const existingProduct = products.find(
      (product) =>
        product.name.toLowerCase() ===
          productData.name.toLowerCase() &&
        product.category ===
          productData.category
    );

    if (existingProduct) {
      const updatedProducts = products.map(
        (product) =>
          product.id === existingProduct.id
            ? {
                ...product,
                stock:
                  product.stock +
                  productData.stock,
              }
            : product
      );

      setProducts(updatedProducts);

      showAlert(
        "warning",
        "Product already exists. Stock updated."
      );

      closeModal();

      return;
    }

    // Add New Product
    const lastProduct =
      products[products.length - 1];

    const newProduct = {
      ...productData,
      id: lastProduct
        ? lastProduct.id + 1
        : 1,
    };

    setProducts([
      ...products,
      newProduct,
    ]);

    showAlert(
      "success",
      "Product added successfully."
    );

    closeModal();
  }

  // ----------------------------
  // Delete Product
  // ----------------------------

  function confirmDelete() {
    if (!productToDelete) return;

    const updatedProducts =
      products.filter(
        (product) =>
          product.id !==
          productToDelete.id
      );

    setProducts(updatedProducts);

    showAlert(
      "danger",
      "Product deleted successfully."
    );

    setProductToDelete(null);
  }

  // ----------------------------
  // Search + Category Filter
  // ----------------------------

  const filteredProducts =
    products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category ===
          "All Categories" ||
        product.category ===
          category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // ----------------------------
  // Pagination
  // ----------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        productsPerPage
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct -
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
      return (
    <AdminLayout>
      <h2 className="mb-4">Products</h2>

      {/* Alert */}
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() =>
          setAlert({
            type: "",
            message: "",
          })
        }
      />

      {/* Toolbar */}
      <ProductToolbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        openModal={openAddModal}
      />

      {/* Reset Button */}
      <button
        className="btn btn-secondary mb-3"
        onClick={resetProducts}
      >
        Reset Inventory
      </button>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <Modal
          title={
            editingProduct
              ? "Edit Product"
              : "Add Product"
          }
          onClose={closeModal}
        >
          <AddProductForm
            onAddProduct={saveProduct}
            onCancel={closeModal}
            initialProduct={editingProduct}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal
          title="Delete Product"
          onClose={() =>
            setProductToDelete(null)
          }
        >
          <p>
            Are you sure you want to delete
            <strong>
              {" "}
              {productToDelete.name}
            </strong>
            ?
          </p>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setProductToDelete(null)
              }
            >
              Cancel
            </button>

            <button
              className="btn btn-danger"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Products Table */}
      <ProductTable
        products={currentProducts}
        search={search}
        category={category}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </AdminLayout>
  );
}

export default Products;