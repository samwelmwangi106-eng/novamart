import { FaTimes } from "react-icons/fa";

function Modal({ title, children, onClose }) {
  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-content border-0 shadow-lg rounded-3">

          {/* Header */}
          <div className="modal-header px-4 py-3">

            <h5 className="modal-title fw-bold mb-0">
              {title}
            </h5>

            <button
              type="button"
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
              }}
              aria-label="Close"
              onClick={onClose}
            >
              <FaTimes />
            </button>

          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Modal;