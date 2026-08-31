import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import {
  FaUser,
  FaBox,
  FaClipboardCheck,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";

function OrderDetailsModal({ order, onClose }) {
  return (
    <Modal
      title={`Order #${order.id}`}
      onClose={onClose}
    >
      {/* Order Header */}
      <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
        <div
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: "50px",
            height: "50px",
          }}
        >
          <FaShoppingCart />
        </div>

        <div>
          <h5 className="mb-1">
            Order #{order.id}
          </h5>

          <small className="text-muted">
            Order information
          </small>
        </div>
      </div>

      {/* Customer */}
      <div className="d-flex align-items-center border-bottom py-3">
        <FaUser className="text-primary me-3" />

        <div className="flex-grow-1">
          <small className="text-muted d-block">
            Customer
          </small>

          <span className="fw-semibold">
            {order.customer}
          </span>
        </div>
      </div>

      {/* Product */}
      <div className="d-flex align-items-center border-bottom py-3">
        <FaBox className="text-primary me-3" />

        <div className="flex-grow-1">
          <small className="text-muted d-block">
            Product
          </small>

          <span className="fw-semibold">
            {order.product}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="d-flex align-items-center border-bottom py-3">
        <FaClipboardCheck className="text-primary me-3" />

        <div className="flex-grow-1">
          <small className="text-muted d-block mb-1">
            Order Status
          </small>

          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Total */}
      <div className="d-flex align-items-center py-3">
        <FaDollarSign className="text-success me-3" />

        <div className="flex-grow-1">
          <small className="text-muted d-block">
            Total Amount
          </small>

          <span className="fw-bold text-success fs-5">
            $
            {Number(order.total).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Close Button */}
      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn btn-secondary px-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default OrderDetailsModal;