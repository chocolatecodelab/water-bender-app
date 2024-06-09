import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Body, BodyLarge } from '../labels/Labels';
import { COLOR_PRIMARY, COLOR_TRANSPARENT_DISABLED, COLOR_TRANSPARENT_PRIMARY, COLOR_WHITE } from '../../tools/constant';
import { iconTools } from '../../tools/helper';
import Button from '../button/Button';

const Calendar = ({ value, onChangeDate, closeDate, onChangeFinishDate }) => {
    const [date, setDate] = useState(value);
    const [selectedDate, setSelectedDate] = useState(null)
    const [buttonSubmit, setButtonSubmit] = useState(true)
        ;
    const days = [];
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',];

    // Get the first day of the month
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // Get the last day of the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // Get the day of the week of the first day
    // (Sunday = 0, Monday = 1, Tuesday = 2, ...)
    const firstDayOfWeek = firstDay.getDay();

    // Fill the days array with the dates of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(i);
    }

    // Fill the days array with the remaining days of the previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.unshift(null);
    }

    // Fill the days array with the remaining days of the next month
    for (let i = 1; days.length % 7 !== 0; i++) {
        days.push(null);
    }

    const handlerSubmit = () => {
        closeDate()
        onChangeDate(selectedDate)
        const newFinishDate = new Date(selectedDate);
        newFinishDate.setDate(newFinishDate.getDate() + 3);
        onChangeFinishDate(newFinishDate)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{
                        backgroundColor: COLOR_PRIMARY,
                        padding: 6,
                        borderRadius: 5
                    }}
                    onPress={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
                >
                    <iconTools.Ionicons
                        name={'chevron-back-outline'}
                        color={COLOR_WHITE}
                        size={18}
                    />
                </TouchableOpacity>
                <BodyLarge bold style={{ color: COLOR_PRIMARY }}>{`${months[date.getMonth()]} ${date.getFullYear()}`}</BodyLarge>
                <TouchableOpacity
                    style={{
                        backgroundColor: COLOR_PRIMARY,
                        padding: 6,
                        borderRadius: 5
                    }}
                    onPress={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
                >
                    <iconTools.Ionicons
                        name={'chevron-forward-outline'}
                        color={COLOR_WHITE}
                        size={18}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 1.5, borderColor: COLOR_TRANSPARENT_DISABLED, marginBottom: 10 }}>
                    <Body style={[styles.day, { textAlign: 'center' }]}>Su</Body>
                    <Body style={[styles.day, { textAlign: 'center' }]}>Mo</Body>
                    <Body style={[styles.day, { textAlign: 'center' }]}>Tu</Body>
                    <Body style={[styles.day, { textAlign: 'center' }]}>We</Body>
                    <Body style={[styles.day, { textAlign: 'center' }]}>Th</Body>
                    <Body style={[styles.day, { textAlign: 'center' }]}>Fr</Body>
                    <Body style={[styles.day, { textAlign: 'center' }]}>Sa</Body>
                </View>
                {
                    selectedDate !== null ?
                        <>
                            {days.map((day, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.day,
                                        day === null && styles.empty,
                                        day === selectedDate.getDate() && styles.selected,
                                    ]}
                                    onPress={() => [setButtonSubmit(false), setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day))]}
                                >
                                    <Body style={[
                                        day === null && styles.emptyText,
                                        day === selectedDate.getDate() && styles.selectedText,
                                    ]}>
                                        {day}
                                    </Body>
                                </TouchableOpacity>
                            ))}
                        </>
                        :
                        <>
                            {days.map((day, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.day,
                                        day === null && styles.empty,
                                    ]}
                                    onPress={() => [setButtonSubmit(false), setSelectedDate(new Date(date.getFullYear(), date.getMonth(), day))]}
                                >
                                    <Body style={[
                                        day === null && styles.emptyText,
                                    ]}>
                                        {day}
                                    </Body>
                                </TouchableOpacity>
                            ))}
                        </>
                }

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button
                    caption={'Cancel'}
                    textStyle={{ color: COLOR_PRIMARY }}
                    containerStyle={{ marginTop: 20, backgroundColor: COLOR_WHITE, alignItems: 'flex-end' }}
                    onPress={closeDate}
                />
                <Button
                    caption={'Ok'}
                    textStyle={{ color: buttonSubmit == false ? COLOR_PRIMARY : COLOR_TRANSPARENT_PRIMARY }}
                    containerStyle={{ paddingHorizontal: 0, marginTop: 20, backgroundColor: COLOR_WHITE, alignItems: 'flex-end' }}
                    onPress={handlerSubmit}
                    disabled={buttonSubmit}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    body: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    day: {
        width: '14.2857%',
        // aspectRatio: 1,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        opacity: 0,
    },
    selected: {
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 30
    },
    emptyText: {
        opacity: 0,
    },
    selectedText: {
        color: '#fff',
    },
});

export default Calendar;
