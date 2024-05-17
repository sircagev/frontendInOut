import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";

export const Modalupdatel = ({ isOpen, onClose, formUpdate, title }) => {
    const { onOpenChange } = useDisclosure();   

    return (
        <Modal
            backdrop="opaque"
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
            className='my-auto backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"'
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    {formUpdate}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
