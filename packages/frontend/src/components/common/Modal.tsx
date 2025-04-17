import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  // DaisyUI modals are responsive by default, specific size classes can be added if needed
  // size?: "sm" | "md" | "lg" | "xl";
  className?: string; // For adding classes to modal-box
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  // DaisyUI specific options
  bottom?: boolean; // modal-bottom
  middle?: boolean; // modal-middle (default)
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  // size = "md", // Removed, use className for sizing if needed e.g., 'max-w-xl'
  className = "",
  closeOnEsc = true,
  closeOnOverlayClick = true,
  bottom = false,
  middle = true,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync dialog state with isOpen prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        if (!dialog.hasAttribute("open")) {
          dialog.showModal();
        }
      } else {
        if (dialog.hasAttribute("open")) {
          dialog.close();
        }
      }
    }
  }, [isOpen]);

  // Handle closing events
  useEffect(() => {
    const dialog = dialogRef.current;

    const handleClose = () => {
      if (isOpen) {
        onClose();
      }
    };

    const handleCancel = (e: Event) => {
      e.preventDefault(); // Prevent default dialog cancel behavior if needed
      if (closeOnEsc && isOpen) {
        onClose();
      }
    };

    if (dialog) {
      dialog.addEventListener("close", handleClose);
      dialog.addEventListener("cancel", handleCancel);
      // DaisyUI handles backdrop click close by default if using <form method="dialog"> inside
      // Or we can handle it manually:
      const handleBackdropClick = (event: MouseEvent) => {
        if (closeOnOverlayClick && event.target === dialog) {
          onClose();
        }
      };
      if (closeOnOverlayClick) {
        dialog.addEventListener("click", handleBackdropClick);
      }

      return () => {
        dialog.removeEventListener("close", handleClose);
        dialog.removeEventListener("cancel", handleCancel);
        if (closeOnOverlayClick) {
          dialog.removeEventListener("click", handleBackdropClick);
        }
      };
    }
  }, [onClose, closeOnEsc, closeOnOverlayClick, isOpen]); // Added isOpen dependency

  const modalPositionClass = bottom
    ? "modal-bottom"
    : middle
      ? "modal-middle"
      : "";

  return (
    <dialog ref={dialogRef} className={`modal ${modalPositionClass}`}>
      <div className={`modal-box ${className}`}>
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        <div className="py-4">
          {" "}
          {/* Added padding around children */}
          {children}
        </div>
        {footer && (
          <div className="modal-action">
            {" "}
            {/* Use modal-action for footer buttons */}
            {footer}
          </div>
        )}
        {/* Optional: Add a default close button if needed and not handled by footer */}
        {/* \
         <form method="dialog" className="modal-backdrop">
           <button>close</button>
         </form> 
         Or a button inside modal-action: 
         <form method="dialog">
           <button className="btn">Close</button>
         </form>
         */}
      </div>
      {/* Optional backdrop close mechanism */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
};

export default Modal;
