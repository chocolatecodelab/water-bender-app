import { StyleSheet, Modal, TouchableOpacity, Text, View, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLOR_DISABLED, COLOR_ERROR, COLOR_MEDIUM_BLACK, COLOR_PRIMARY, COLOR_PRIMARY_ACCEPT, COLOR_WHITE } from '../../tools/constant';
import { iconTools } from '../../tools/helper';
import Button from '../button/Button';

const MyModalConfirm = ({ isVisible, message, closeModal, loading, disabled, transparent = 0.6, onSubmit, animationType }) => {
    const [showModal, setShowModal] = useState(isVisible);

    const toggleModal = () => {
        if (isVisible) {
            setShowModal(true);
        } else {
            setShowModal(false)
        }
    };

    useEffect(() => {
        toggleModal();
    }, [isVisible]);

    return (
        <Modal transparent={true} visible={showModal} statusBarTranslucent={true} animationType={animationType}>
            {/* <KeyboardAvoidingView behavior={"padding"} style={[StyleSheet.absoluteFillObject, styles.modalBackGround]}> */}
            <Pressable
                style={[StyleSheet.absoluteFillObject, styles.modalBackGround, { backgroundColor: `'rgba(0,0,0,${transparent})'` }]}
            // onPress={closeModal}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 5,
                            right: 10
                        }}
                        onPress={closeModal}>
                        <iconTools.MaterialIcons
                            name={'close'}
                            size={25}
                            color={COLOR_DISABLED}
                        />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                        <Image
                            source={require('../../assets/images/info.png')}
                            style={{ height: 100, width: 200, marginTop: 15, marginBottom: 5 }}
                            resizeMode='contain'
                        />
                        <Text style={styles.text}>
                            {message}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Button
                            caption={'No'}
                            containerStyle={{ flex: 1, marginRight: 6, backgroundColor: COLOR_ERROR }}
                            onPress={closeModal}
                            loading={loading}
                            disabled={disabled}
                        />
                        <Button
                            caption={'Yes'}
                            containerStyle={{ flex: 1, marginLeft: 6, backgroundColor: COLOR_PRIMARY_ACCEPT }}
                            onPress={onSubmit}
                            loading={loading}
                            disabled={disabled}
                        />
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}

export default MyModalConfirm

const styles = StyleSheet.create({
    modalBackGround: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: COLOR_WHITE,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 20,
        maxHeight: '80%',
    },
    text: {
        textAlign: 'center',
        textTransform: 'capitalize',
        fontSize: 20,
        fontWeight: '500',
        color: COLOR_MEDIUM_BLACK,
        marginBottom: 10
    }
})