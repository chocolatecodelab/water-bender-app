import { StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Text, View, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLOR_DISABLED, COLOR_MEDIUM_BLACK, COLOR_PRIMARY, COLOR_WHITE } from '../../tools/constant';
import { iconTools } from '../../tools/helper';

const MyModalInfo = ({ isVisible, message, closeModal, transparent = 0.6 }) => {
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
        <Modal transparent={true} visible={showModal} statusBarTranslucent={true} animationType='fade'>
            {/* <KeyboardAvoidingView behavior={"padding"} style={[StyleSheet.absoluteFillObject, styles.modalBackGround]}> */}
            <Pressable
                style={[StyleSheet.absoluteFillObject, styles.modalBackGround, { backgroundColor: `rgba(0,0,0,${transparent})` }]}
                onPress={() => closeModal()}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 5,
                            right: 10
                        }}
                        onPress={() => closeModal()}>
                        <iconTools.MaterialIcons
                            name={'close'}
                            size={25}
                            color={COLOR_DISABLED}
                        />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                        <Image
                            source={require('../../assets/images/info.png')}
                            style={{ height: 100, width: 100, marginTop: 15, marginBottom: 5 }}
                            resizeMode='contain'
                        />
                        <Text style={styles.text}>
                            {message}
                        </Text>
                    </View>
                </View>
            </Pressable>
            {/* </KeyboardAvoidingView> */}
        </Modal>
    )
}

export default MyModalInfo

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