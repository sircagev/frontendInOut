import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

export default function Modal1({ isOpen, onClose, form, title, size }) {
  return (
    <Modal size={size} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {form}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
