import { useState } from 'react';

/**
 * useDateSelection - Custom hook for managing date selection state and modal visibility
 * 
 * @description This hook manages date selection logic including start/end dates
 * and modal visibility states for the date picker component.
 * 
 * @returns {Object} Date selection state and handlers
 * @returns {Date} startDate - Selected start date
 * @returns {Date} finishDate - Selected finish date  
 * @returns {Function} setStartDate - Function to update start date
 * @returns {Function} setFinishDate - Function to update finish date
 * @returns {boolean} modalStartDate - Modal visibility state
 * @returns {Function} setModalStartDate - Function to toggle modal visibility
 * @returns {Function} openDateModal - Function to open date selection modal
 * @returns {Function} closeDateModal - Function to close date selection modal
 * 
 * @example
 * const {
 *   startDate,
 *   finishDate,
 *   setStartDate,
 *   setFinishDate,
 *   modalStartDate,
 *   openDateModal,
 *   closeDateModal
 * } = useDateSelection();
 * 
 * @author Water Monitoring Dashboard Team
 * @version 1.0.0
 */
const useDateSelection = () => {
  // ===== DATE SELECTION STATE =====
  const [startDate, setStartDate] = useState(new Date());
  const [finishDate, setFinishDate] = useState(new Date());
  
  // ===== MODAL STATE =====
  const [modalStartDate, setModalStartDate] = useState(false);
  
  // ===== HELPER FUNCTIONS =====
  
  /**
   * Open date selection modal
   */
  const openDateModal = () => {
    setModalStartDate(true);
  };
  
  /**
   * Close date selection modal
   */
  const closeDateModal = () => {
    setModalStartDate(false);
  };
  
  return {
    // Date state
    startDate,
    finishDate,
    setStartDate,
    setFinishDate,
    
    // Modal state
    modalStartDate,
    setModalStartDate,
    
    // Helper functions
    openDateModal,
    closeDateModal,
  };
};

export default useDateSelection;