import "../../css/Modal.css";

const Modal = ({ show, onClose, children }) => {
  // If "show" is false, don't render anything
  if (!show) return null;

  // Closes the modal if the user clicks the dark area outside the box
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        {/* Close Button (X) in the top right corner */}
        <button className="modal-close-x" onClick={onClose}>
          &times;
        </button>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;