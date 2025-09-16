/**
 * Calendar Component (DatePicker)
 * 
 * A custom calendar component for date selection with automatic
 * date range calculation. When a date is selected, it automatically
 * sets a 3-day range for data filtering purposes.
 * 
 * Features:
 * - Month navigation with arrow controls
 * - Single date selection with visual feedback
 * - Automatic 3-day range calculation
 * - Responsive grid layout
 * - Consistent styling with app theme
 * - Submit/Cancel actions
 * 
 * @component
 * @example
 * <Calendar
 *   value={selectedDate}
 *   onChangeDate={(date) => setStartDate(date)}
 *   onChangeFinishDate={(date) => setEndDate(date)}
 *   closeDate={() => setShowCalendar(false)}
 * />
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body, BodyLarge } from '../labels/Labels';
import { 
    COLOR_PRIMARY, 
    COLOR_TRANSPARENT_DISABLED, 
    COLOR_TRANSPARENT_PRIMARY, 
    COLOR_WHITE 
} from '../../tools/constant';
import { iconTools } from '../../tools/helper';

/**
 * Calendar Props Interface
 * @typedef {Object} CalendarProps
 * @property {Date} value - Initially selected date
 * @property {Function} onChangeDate - Callback when date changes
 * @property {Function} closeDate - Callback to close calendar
 * @property {Function} onChangeFinishDate - Callback when finish date is set
 */

// ===== CONSTANTS =====
const MONTHS = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DATE_RANGE_DAYS = 3; // Number of days to add to selected date for range

// ===== HELPER FUNCTIONS =====

/**
 * Generates an array of days for the current month view
 * including empty spaces for proper calendar grid alignment
 * @param {Date} date - The current viewing date
 * @returns {Array} Array of day numbers and null values for empty spaces
 */
const generateCalendarDays = (date) => {
    const days = [];
    
    // Get month boundaries
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const firstDayOfWeek = firstDay.getDay();

    // Fill with empty spaces for days before month start
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }

    // Fill with actual days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(i);
    }

    // Fill remaining spaces to complete the week
    while (days.length % 7 !== 0) {
        days.push(null);
    }

    return days;
};

/**
 * Calculates the finish date based on selected date + range
 * @param {Date} selectedDate - The selected start date
 * @returns {Date} Calculated finish date
 */
const calculateFinishDate = (selectedDate) => {
    const finishDate = new Date(selectedDate);
    finishDate.setDate(finishDate.getDate() + DATE_RANGE_DAYS);
    return finishDate;
};

// ===== COMPONENT STYLES =====
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_WHITE,
        borderRadius: 0, // Remove border radius as modal handles it
        minHeight: 400, // Ensure minimum height
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        marginBottom: 20,
    },
    navigationButton: {
        backgroundColor: COLOR_PRIMARY,
        padding: 12,
        borderRadius: 12,
        shadowColor: COLOR_PRIMARY,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthYearText: {
        color: COLOR_PRIMARY,
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 0.3,
    },
    body: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    weekdaysRow: {
        flexDirection: 'row',
        borderBottomWidth: 0, // Remove border
        marginBottom: 16,
        paddingBottom: 0,
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
        paddingVertical: 12,
        borderRadius: 12,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    dayCell: {
        width: '14.2857%', // 100% / 7 days
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },
    emptyCell: {
        opacity: 0,
    },
    selectedCell: {
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 24,
        shadowColor: COLOR_PRIMARY,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
        transform: [{ scale: 1.1 }], // Slight scale for emphasis
    },
    dayText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    selectedDayText: {
        color: COLOR_WHITE,
        fontWeight: '700',
        fontSize: 16,
    },
    weekdayText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLOR_PRIMARY,
    },
    emptyText: {
        opacity: 0,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
        gap: 16,
    },
    modernButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    cancelButton: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    submitButton: {
        shadowColor: COLOR_PRIMARY,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
});

// ===== COMPONENT RENDERERS =====

/**
 * Renders the calendar header with month navigation
 */
const renderHeader = (date, navigateMonth) => (
    <View style={styles.header}>
        <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigateMonth(-1)}
            activeOpacity={0.8}
            testID="prev-month-button"
        >
            <iconTools.Ionicons
                name="chevron-back-outline"
                color={COLOR_WHITE}
                size={18}
            />
        </TouchableOpacity>

        <BodyLarge style={styles.monthYearText}>
            {`${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
        </BodyLarge>

        <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigateMonth(1)}
            activeOpacity={0.8}
            testID="next-month-button"
        >
            <iconTools.Ionicons
                name="chevron-forward-outline"
                color={COLOR_WHITE}
                size={18}
            />
        </TouchableOpacity>
    </View>
);

/**
 * Renders the weekdays header row
 */
const renderWeekdays = () => (
    <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day, index) => (
            <View key={index} style={styles.dayCell}>
                <Body style={[styles.dayText, styles.weekdayText]}>{day}</Body>
            </View>
        ))}
    </View>
);

/**
 * Renders the calendar days grid
 */
const renderCalendarDays = (date, selectedDate, onDaySelect) => {
    const days = generateCalendarDays(date);
    
    return (
        <View style={styles.calendarGrid}>
            {days.map((day, index) => {
                const isSelected = selectedDate && 
                    day === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear();
                
                const isEmpty = day === null;

                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dayCell,
                            isEmpty && styles.emptyCell,
                            isSelected && styles.selectedCell,
                        ]}
                        onPress={() => !isEmpty && onDaySelect(day)}
                        disabled={isEmpty}
                        activeOpacity={0.7}
                        testID={`calendar-day-${day}`}
                    >
                        <Body
                            style={[
                                styles.dayText,
                                isEmpty && styles.emptyText,
                                isSelected && styles.selectedDayText,
                            ]}
                        >
                            {day}
                        </Body>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

/**
 * Renders action buttons (Cancel/OK)
 */
const renderActionButtons = (onCancel, onSubmit, isSubmitDisabled) => (
    <View style={styles.actionButtons}>
        <TouchableOpacity
            style={[styles.modernButton, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.8}
        >
            <Body style={{ 
                color: 'rgba(0,0,0,0.7)', 
                fontWeight: '600',
                fontSize: 15 
            }}>
                Cancel
            </Body>
        </TouchableOpacity>
        
        <TouchableOpacity
            style={[
                styles.modernButton, 
                styles.submitButton,
                { 
                    backgroundColor: isSubmitDisabled 
                        ? COLOR_TRANSPARENT_DISABLED 
                        : COLOR_PRIMARY,
                    opacity: isSubmitDisabled ? 0.6 : 1
                }
            ]}
            onPress={onSubmit}
            disabled={isSubmitDisabled}
            activeOpacity={0.8}
        >
            <Body style={{ 
                color: isSubmitDisabled ? 'rgba(0,0,0,0.4)' : COLOR_WHITE,
                fontWeight: '700',
                fontSize: 15,
                letterSpacing: 0.3
            }}>
                Select Date
            </Body>
        </TouchableOpacity>
    </View>
);

// ===== MAIN COMPONENT =====

/**
 * Main Calendar Component
 */
const Calendar = ({
    value = new Date(),
    onChangeDate = () => {},
    closeDate = () => {},
    onChangeFinishDate = () => {},
}) => {
    // Component state
    const [date, setDate] = useState(value || new Date());
    const [selectedDate, setSelectedDate] = useState(value || null); // Set initial selected date dari props

    // Effect to update state when value prop changes
    React.useEffect(() => {
        if (value) {
            const newDate = new Date(value);
            setDate(newDate); // Set calendar view to the month of selected date
            setSelectedDate(newDate);
        }
    }, [value]);

    // Handle month navigation
    const navigateMonth = (direction) => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + direction);
        setDate(newDate);
    };

    // Handle day selection
    const handleDaySelect = (day) => {
        const newSelectedDate = new Date(date.getFullYear(), date.getMonth(), day);
        setSelectedDate(newSelectedDate);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!selectedDate) return;

        const finishDate = calculateFinishDate(selectedDate);
        
        // Call parent callbacks
        onChangeDate(selectedDate);
        onChangeFinishDate(finishDate);
        closeDate();
    };

    // Determine if submit button should be disabled
    const isSubmitDisabled = !selectedDate;

    return (
        <View style={styles.container}>
            {/* Month/Year header with navigation */}
            {renderHeader(date, navigateMonth)}

            {/* Calendar body */}
            <View style={styles.body}>
                {/* Weekdays header */}
                {renderWeekdays()}

                {/* Calendar days grid */}
                {renderCalendarDays(date, selectedDate, handleDaySelect)}

                {/* Action buttons */}
                {renderActionButtons(closeDate, handleSubmit, isSubmitDisabled)}
            </View>
        </View>
    );
};

// ===== DEFAULT PROPS =====
Calendar.defaultProps = {
    value: new Date(),
    onChangeDate: () => console.warn('Calendar: onChangeDate prop is required'),
    closeDate: () => console.warn('Calendar: closeDate prop is required'),
    onChangeFinishDate: () => console.warn('Calendar: onChangeFinishDate prop is required'),
};

export default Calendar;
