import Modal from "./Modal";

function OrderDetailsModal({
  order,
  onClose,
}) {
  return (
    <Modal
      title={`Order #${order.id}`}
      onClose={onClose}
    >
      <p>
        <strong>Customer:</strong>{" "}
        {order.customer}
      </p>

      <p>
        <strong>Product:</strong>{" "}
        {order.product}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {order.status}
      </p>

      <p>
        <strong>Total:</strong> $
        {order.total}
      </p>

      <div className="text-end mt-4">
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default OrderDetailsModal;