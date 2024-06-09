import { StyleSheet, View, Modal, Animated, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLOR_PRIMARY, COLOR_WHITE } from '../../tools/constant';
import { android, ios, iconTools } from '../../tools/helper';
import { BodyLarge } from '../labels/Labels';

const CustomModal = ({ isVisible, children, closeModal, transparent = 0.6, headerActive, headerTitle, headerColor, contentStyle }) => {
    const [showModal, setShowModal] = useState(isVisible);
    const toggleModal = () => {
        if (isVisible) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    useEffect(() => {
        toggleModal();
    }, [isVisible]);

    return (
        <Modal transparent visible={showModal} statusBarTranslucent={true} animationType='fade'>
            <KeyboardAvoidingView behavior={"padding"} style={[StyleSheet.absoluteFillObject, styles.modalBackGround, { backgroundColor: `'rgba(0,0,0,${transparent})'` }]}>
                {/* <View style={[styles.modalBackGround]}> */}
                <TouchableOpacity
                    onPress={() => closeModal()}
                    style={{ height: '100%', width: '100%', position: 'absolute' }}
                />
                <View style={styles.modalContainer}>
                    {headerActive &&
                        <View style={[styles.header, { backgroundColor: headerColor ? headerColor : COLOR_PRIMARY }]}>
                            <BodyLarge bold style={{ textAlign: 'center', color: COLOR_WHITE }}>{headerTitle}</BodyLarge>
                            <TouchableOpacity
                                style={{ position: 'absolute', right: ios ? 5 : 7, top: ios ? 5 : 8 }}
                                onPress={() => closeModal()}
                            >
                                <iconTools.MaterialIcons
                                    name={'close'}
                                    size={25}
                                    color={COLOR_WHITE}
                                />
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={{ ...contentStyle }}>
                        {children}
                    </View>
                </View>
                {/* </View> */}
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default CustomModal

const styles = StyleSheet.create({
    modalBackGround: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: COLOR_WHITE,
        borderRadius: 10,
        elevation: 20,
        maxHeight: '80%',
    },
    header: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
})