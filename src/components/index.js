/**
 * Components Export Index
 * 
 * This file serves as the central export point for all reusable UI components
 * in the application. It follows a clean architecture pattern by organizing
 * components into logical groups and providing clear export statements.
 * 
 * @file src/components/index.js
 * @version 1.0.0
 */

// ===== LAYOUT & SCREEN COMPONENTS =====
import BaseScreen from './baseScreen/baseScreen';
import KeyboardView from './keyboardAwareScrollView/KeyboardAwareScrollView';

// ===== UI COMPONENTS =====
import Button from './button/Button';
import MyHeader from './header/Header';
import DatePicker from './calender/Calender';

// ===== TEXT & LABEL COMPONENTS =====
// Export all label variants (H1, H2, H3, H4, Body, BodyLarge, etc.)
export * from './labels/Labels';

// ===== MODAL COMPONENTS =====
import MyModal from './modal/Modal';
import MyModalError from './modalError/ModalError';
import MyModalSuccess from './modalSuccess/ModalSuccess';
import MyModalInfo from './modalInfo/ModalInfo';
import MyModalConfirm from './modalConfirm/ModalConfirm';

// ===== COMPONENT EXPORTS =====
export {
    // Layout Components
    BaseScreen,
    KeyboardView,
    
    // UI Components  
    Button,
    MyHeader,
    DatePicker,
    
    // Modal Components
    MyModal,
    MyModalError,
    MyModalInfo,
    MyModalSuccess,
    MyModalConfirm,
};

/**
 * Usage Examples:
 * 
 * // Import specific components
 * import { BaseScreen, Button, H1 } from '@components';
 * 
 * // Import with destructuring
 * import { MyModal, MyModalConfirm } from '@components';
 */