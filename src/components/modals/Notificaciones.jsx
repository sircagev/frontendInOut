import React, { useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const NotificationItem = ({ count, text, onClick, icon }) => (
  <motion.div
    className="flex items-center mb-2 hover:bg-gray-200 p-2 rounded cursor-pointer"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <p className="flex-1 text-black pr-5">
      <span className="text-blue-700 font-bold">{count}</span> {text}
    </p>
    {icon}
  </motion.div>
);

const NotificationsModal = ({
  showModal,
  setShowModal,
  elementosConBajoStock,
  prestamosActivos,
}) => {
  const navigate = useNavigate();

  const handleViewStockClick = useCallback(() => {
    setShowModal(false);
    navigate("/reportes/stockmin");
  }, [setShowModal, navigate]);

  const handleViewPrestamosClick = useCallback(() => {
    setShowModal(false);
    navigate("/reportes/prestamosactivos");
  }, [setShowModal, navigate]);

  const handleClose = useCallback(() => setShowModal(false), [setShowModal]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal, handleClose]);

  const notifications = useMemo(() => [
    { count: elementosConBajoStock, text: 'Elementos con bajo Stock', onClick: handleViewStockClick },
    { count: prestamosActivos, text: 'Préstamos activos', onClick: handleViewPrestamosClick },
  ], [elementosConBajoStock, prestamosActivos, handleViewStockClick, handleViewPrestamosClick]);

  if (!showModal || (elementosConBajoStock === 0 && prestamosActivos === 0)) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-50 cursor-pointer"
            onClick={handleClose}
            aria-label="Cerrar modal"
          />
          <motion.div
            className="absolute top-[30px] right-[85px] bg-white p-6 rounded-lg shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl text-black font-bold mb-4 text-center">
              Notificaciones
            </h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
              aria-label="Cerrar notificaciones"
            >
              <FaTimes size={24} />
            </button>
            {notifications.map((notification, index) => (
              notification.count > 0 && (
                <NotificationItem
                  key={index}
                  {...notification}
                  icon={<FaSearch className="text-blue-900" />}
                />
              )
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsModal;