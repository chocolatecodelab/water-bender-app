/**
 * CustomModal Component
 * 
 * A flexible and reusable modal component that provides consistent
 * modal behavior across the application. Supports custom styling,
 * keyboard handling, and optional header configurations.
 * 
 * Features:
 * - Smooth fade animations
 * - Keyboard-aware layout with KeyboardAvoidingView
 * - Customizable background opacity
 * - Optional header with close button
 * - Touch-outside-to-close functionality
 * - Responsive sizing and positioning
 * - Status bar transparency support
 * 
 * @component
 * @example
 * // Basic modal
 * <CustomModal isVisible={showModal} closeModal={() => setShowModal(false)}>
 *   <Text>Modal content here</Text>
 * </CustomModal>
 * 
 * // Modal with header
 * <CustomModal
 *   isVisible={showModal}
 *   closeModal={() => setShowModal(false)}
 *   headerActive
 *   headerTitle="Settings"
 *   headerColor={COLOR_PRIMARY}
 * >
 *   <SettingsContent />
 * </CustomModal>
 * 
 * // Custom styled modal
 * <CustomModal
 *   isVisible={showModal}
 *   closeModal={() => setShowModal(false)}
 *   transparent={0.8}
 *   contentStyle={{ padding: 20 }}
 * >
 *   <CustomContent />
 * </CustomModal>
 */

import React, { useEffect, useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Modal, 
    TouchableOpacity, 
    KeyboardAvoidingView 
} from 'react-native';
import { COLOR_PRIMARY, COLOR_WHITE } from '../../tools/constant';
import { android, ios, iconTools } from '../../tools/helper';
import { BodyLarge } from '../labels/Labels';

/**
 * CustomModal Props Interface
 * @typedef {Object} CustomModalProps
 * @property {boolean} isVisible - Controls modal visibility
 * @property {React.ReactNode} children - Content to display in modal
 * @property {Function} closeModal - Function to call when closing modal
 * @property {number} transparent - Background opacity (0-1), default 0.6
 * @property {boolean} headerActive - Whether to show header section
 * @property {string} headerTitle - Title text for header
 * @property {string} headerColor - Background color for header
 * @property {Object} contentStyle - Custom styles for content container
 */

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 420, // Better width for tablets/larger screens
        backgroundColor: COLOR_WHITE,
        borderRadius: 24, // More modern rounded corners
        elevation: 24,
        maxHeight: '90%', // Better height utilization
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.15, // Softer shadow
        shadowRadius: 20,
        overflow: 'hidden', // Ensure rounded corners work properly
    },
    header: {
        borderBottomWidth: 0, // Remove border for cleaner look
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(25, 118, 210, 0.02)', // Subtle background
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundTouchable: {
        height: '100%',
        width: '100%',
        position: 'absolute',
    },
});

// ===== COMPONENT RENDERERS =====

/**
 * Renders the modal header with title and close button
 * @param {boolean} headerActive - Whether header should be rendered
 * @param {string} headerTitle - Header title text
 * @param {string} headerColor - Header background color
 * @param {Function} closeModal - Close modal function
 * @returns {React.ReactElement|null} Header component or null
 */
const renderHeader = (headerActive, headerTitle, headerColor, closeModal) => {
    if (!headerActive) return null;

    return (
        <View style={[styles.header, { backgroundColor: headerColor || COLOR_PRIMARY }]}>
            <BodyLarge 
                bold 
                style={{ 
                    textAlign: 'center', 
                    color: headerColor ? COLOR_WHITE : COLOR_PRIMARY,
                    flex: 1,
                    fontSize: 20,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                }}
            >
                {headerTitle || 'Modal'}
            </BodyLarge>
            
            <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                activeOpacity={0.7}
                testID="modal-close-button"
            >
                <iconTools.MaterialIcons
                    name="close"
                    size={20}
                    color={'rgba(0,0,0,0.6)'}
                />
            </TouchableOpacity>
        </View>
    );
};

/**
 * Renders the modal background overlay
 * @param {number} transparency - Background opacity value
 * @param {Function} closeModal - Close modal function
 * @returns {React.ReactElement} Background touchable component
 */
const renderBackground = (transparency, closeModal) => (
    <TouchableOpacity
        style={styles.backgroundTouchable}
        onPress={closeModal}
        activeOpacity={1}
        testID="modal-background"
    />
);

// ===== MAIN COMPONENT =====

/**
 * Main CustomModal Component
 * Manages modal state and renders modal content with animations
 */
const CustomModal = ({
    isVisible = false,
    children,
    closeModal = () => {},
    transparent = 0.6,
    headerActive = false,
    headerTitle = '',
    headerColor = COLOR_PRIMARY,
    contentStyle = {},
}) => {
    // Local state for controlling modal visibility with animations
    const [showModal, setShowModal] = useState(isVisible);

    // Effect to handle modal visibility changes
    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
        } else {
            // Add slight delay for smooth animation
            const timer = setTimeout(() => {
                setShowModal(false);
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Validate required props
    if (headerActive && !headerTitle) {
        console.warn('CustomModal: headerTitle is recommended when headerActive is true');
    }

    // Generate dynamic background color with transparency
    const backgroundColor = `rgba(0, 0, 0, ${Math.max(0, Math.min(1, transparent))})`;

    return (
        <Modal
            transparent
            visible={showModal}
            statusBarTranslucent
            animationType="fade"
            onRequestClose={closeModal} // Android back button support
            testID="custom-modal"
        >
            <KeyboardAvoidingView
                behavior={ios ? 'padding' : 'height'}
                style={[
                    StyleSheet.absoluteFillObject,
                    styles.modalBackground,
                    { backgroundColor }
                ]}
            >
                {/* Background overlay for touch-to-close */}
                {renderBackground(transparent, closeModal)}

                {/* Main modal container */}
                <View style={styles.modalContainer}>
                    {/* Optional header */}
                    {renderHeader(headerActive, headerTitle, headerColor, closeModal)}

                    {/* Modal content */}
                    <View style={[{ 
                        padding: headerActive ? 24 : 24,
                        paddingTop: headerActive ? 0 : 24 
                    }, contentStyle]}>
                        {children}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// ===== DEFAULT PROPS =====
CustomModal.defaultProps = {
    isVisible: false,
    transparent: 0.6,
    headerActive: false,
    headerTitle: '',
    headerColor: COLOR_PRIMARY,
    contentStyle: {},
    closeModal: () => console.warn('CustomModal: closeModal prop is required'),
};

export default CustomModal;