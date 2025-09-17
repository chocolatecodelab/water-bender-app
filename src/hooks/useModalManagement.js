import { useState } from 'react';

/**
 * useModalManagement - Custom hook for managing various modal states
 * 
 * @description This hook manages multiple modal states including info modals,
 * confirmation modals, and their associated message states.
 * 
 * @returns {Object} Modal state and handlers
 * @returns {boolean} showModalInfo - Info modal visibility state
 * @returns {string} modalConfirm - Confirmation modal state/message
 * @returns {string} messageInfo - Info message content
 * @returns {Function} setShowModalInfo - Function to toggle info modal
 * @returns {Function} setModalConfirm - Function to set confirmation modal state
 * @returns {Function} setMessageInfo - Function to set info message
 * @returns {Function} showInfoModal - Function to show info modal with message
 * @returns {Function} hideInfoModal - Function to hide info modal
 * @returns {Function} showConfirmModal - Function to show confirmation modal
 * @returns {Function} hideConfirmModal - Function to hide confirmation modal
 * 
 * @example
 * const {
 *   showModalInfo,
 *   modalConfirm,
 *   messageInfo,
 *   showInfoModal,
 *   hideInfoModal,
 *   showConfirmModal,
 *   hideConfirmModal
 * } = useModalManagement();
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const useModalManagement = () => {
  // ===== MODAL STATE =====
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [modalConfirm, setModalConfirm] = useState('');
  const [messageInfo, setMessageInfo] = useState('');
  
  // ===== HELPER FUNCTIONS =====
  
  /**
   * Show info modal with a message
   * @param {string} message - Message to display in info modal
   */
  const showInfoModal = (message) => {
    setMessageInfo(message);
    setShowModalInfo(true);
  };
  
  /**
   * Hide info modal and clear message
   */
  const hideInfoModal = () => {
    setShowModalInfo(false);
    setMessageInfo('');
  };
  
  /**
   * Show confirmation modal with a message
   * @param {string} message - Message to display in confirmation modal
   */
  const showConfirmModal = (message = 'Are you sure?') => {
    setModalConfirm(message);
  };
  
  /**
   * Hide confirmation modal and clear message
   */
  const hideConfirmModal = () => {
    setModalConfirm('');
  };
  
  return {
    // Modal state
    showModalInfo,
    modalConfirm,
    messageInfo,
    
    // State setters (for advanced use cases)
    setShowModalInfo,
    setModalConfirm,
    setMessageInfo,
    
    // Helper functions
    showInfoModal,
    hideInfoModal,
    showConfirmModal,
    hideConfirmModal,
  };
};

export default useModalManagement;