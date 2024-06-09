import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, Pressable, View, Image, ImageBackground } from 'react-native'
import { Button, KeyboardView, BaseScreen, MyModalError, BodyExtraSmall, Body, BodySmall } from "../../components";
import { COLOR_BLACK, COLOR_BLUE, COLOR_DISABLED, COLOR_MAIN_SECONDARY, COLOR_PRIMARY, COLOR_SECONDARY_MAIN_ANDROID, COLOR_WHITE, STATUS_TRANSPARENT } from '../../tools/constant';
import { android, getScreenDimension, iPad } from "../../tools/helper";
import { TextInput } from 'react-native-paper';


const Login = ({
    username, password, isError, isSuccess, isLoading, message, onChangeUsername,
    onChangePassword, onSubmitPressed, onNavigationDashboard, onCloseModalError,
    onAppear, onNavigationRegister, onNavigationForgetPassword
}) => {
    const [iconPasssword, setIconPassword] = useState('eye')
    const [showPassword, setShowPassword] = useState(true)
    const [errorUsername, setErrorUsername] = useState(null)
    const [errorPassword, setErrorPassword] = useState(null)
    const { height } = getScreenDimension()
    const handlerVisiblePassword = () => {
        setShowPassword(!showPassword)
        if (!showPassword) return setIconPassword('eye')
        if (showPassword) return setIconPassword('eye-off')
    }
    useEffect(() => {
        if (isSuccess === true) {
            onNavigationDashboard()
        }
    }, [isSuccess])

    useEffect(() => { onAppear() }, [])


    return (
        <BaseScreen
            containerStyle={{ paddingVertical: 0 }}
            // contentStyle={{ backgroundColor: COLOR_PRIMARY }}
            translucent={true}
            barBackgroundColor={COLOR_BLUE}
            statusBarColor={COLOR_WHITE}
        >
            <KeyboardView style={styles.containerKeyboardView(height)}>
                <View style={styles.content(height)}>
                    <ImageBackground
                        source={require('../../assets/images/loginBackgroundWaterBender.png')}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/images/titleWaterBender.png')}
                                style={{
                                    height: iPad ? '30%' : '40%',
                                    width: iPad ? '40%' : '120%',
                                }}
                            />
                            <View style={styles.poins}>
                                <Image
                                    source={require('../../assets/images/waterBender.png')}
                                    style={{
                                        height: 60,
                                        width: 40,
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: .8, paddingHorizontal: iPad ? 50 : 30 }}>
                            <TextInput
                                mode='outlined'
                                label="Username"
                                value={username}
                                onChangeText={(text) => {
                                    setErrorUsername(null)
                                    onChangeUsername(text)
                                }}
                                cursorColor={COLOR_PRIMARY}
                                outlineColor={COLOR_DISABLED}
                                activeOutlineColor={COLOR_PRIMARY}
                                editable={!isLoading}
                                error={errorUsername ? true : false}
                                style={{
                                    backgroundColor: COLOR_WHITE,
                                    marginBottom: iPad ? 20 : 10,
                                    paddingHorizontal: iPad ? 15 : 10,
                                }}
                                theme={{ roundness: 50 }}
                                right={
                                    <TextInput.Icon
                                        icon={'account'}
                                        color={COLOR_DISABLED}
                                        size={iPad ? 30 : 24}
                                    />
                                }
                                autoCapitalize='none'
                            />
                            <TextInput
                                mode='outlined'
                                label="Password"
                                value={password}
                                onChangeText={(text) => {
                                    setErrorPassword(null)
                                    onChangePassword(text)
                                }}
                                cursorColor={COLOR_PRIMARY}
                                outlineColor={COLOR_DISABLED}
                                activeOutlineColor={COLOR_PRIMARY}
                                editable={!isLoading}
                                error={errorPassword ? true : false}
                                style={{
                                    backgroundColor: COLOR_WHITE,
                                    marginBottom: iPad ? 20 : 10,
                                    paddingHorizontal: iPad ? 15 : 10,
                                }}
                                theme={{ roundness: 50 }}
                                right={
                                    <TextInput.Icon
                                        icon={iconPasssword}
                                        color={COLOR_DISABLED}
                                        size={iPad ? 30 : 24}
                                        onPress={() => handlerVisiblePassword()}
                                    />
                                }
                                secureTextEntry={showPassword}
                                autoCapitalize='none'
                            />
                            <Pressable
                                onPress={onNavigationForgetPassword}
                                style={{ alignSelf: 'flex-end' }}
                            >
                                {iPad ?
                                    <Body style={styles.secondText(android)}></Body> :
                                    <BodySmall style={styles.secondText(android)}></BodySmall>
                                }
                            </Pressable>
                            <Button
                                containerStyle={{ marginTop: -50, borderRadius: 30 }}
                                caption='Login'
                                disabled={isLoading}
                                loading={isLoading}
                                onPress={() => onSubmitPressed(username, password, setErrorPassword, setErrorUsername)}
                            />
                            <View style={styles.signup(android)}>
                                <Text style={styles.thirdText} >Don't have an account? </Text>
                                <Pressable
                                    style={{}}
                                    disabled={isLoading}
                                    onPress={onNavigationRegister}
                                >
                                    <Text style={styles.fourthText}>Sign Up</Text>
                                </Pressable>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: iPad ? 100 : android ? 5 : 40
                            }}>
                                <Image
                                    source={require('../../assets/images/kpp.png')}
                                    style={{
                                        height: iPad ? 80 : 50,
                                        width: iPad ? 80 : 50
                                    }}
                                    resizeMode='contain'
                                />
                                {iPad ?
                                    <View style={styles.footerText} >
                                        <Body bold>PT. KALIMANTAN PRIMA PERSADA</Body>
                                        <Body style={{ alignSelf: 'flex-start', fontStyle: 'italic' }}>Integrated Mining Service</Body>
                                    </View>
                                    :
                                    <View style={styles.footerText} >
                                        <BodyExtraSmall bold>PT. KALIMANTAN PRIMA PERSADA</BodyExtraSmall>
                                        <BodyExtraSmall style={{ alignSelf: 'flex-start', fontStyle: 'italic' }}>Integrated Mining Service</BodyExtraSmall>
                                    </View>
                                }
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </KeyboardView>
            <MyModalError
                isVisible={isError}
                closeModal={onCloseModalError}
                message={message}
            />
        </BaseScreen>
    )
}
export default Login

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 9999,
    },
    containerKeyboardView: (height) => ({
        height: '100%',
    }),
    content: (height) => ({
        height,
    }),
    topContent: (height) => ({
        backgroundColor: COLOR_PRIMARY,
        justifyContent: 'center',
        height: height / 4.2,
        alignItems: 'center'
    }),
    mainContent: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: COLOR_WHITE,
        paddingHorizontal: 20,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        paddingTop: 60,
    },
    poins: {
        height: 60,
        width: 60,
        borderRadius: 60,
        backgroundColor: COLOR_WHITE,
        position: 'absolute',
        bottom: iPad ? 50 : 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR_BLUE
    },
    title: (height) => ({
        color: COLOR_WHITE,
        fontSize: height < 600 ? 24 : 34,
        fontWeight: 'bold',
        textAlign: 'center',
    }),
    secondText: (android) => ({
        color: COLOR_DISABLED,
        fontWeight: '600',
        fontSize: 12,
        marginBottom: android ? '20%' : '15%'
    }),
    thirdText: {
        fontSize: 12,
        color: COLOR_BLACK
    },
    fourthText: {
        color: COLOR_MAIN_SECONDARY,
        fontWeight: '500'
    },
    signup: (android) => ({
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
        marginBottom: android ? 20 : 10
    }),
    footerText: {
        backgroundColor: COLOR_WHITE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSize: (height, width) => ({
        marginTop: 20,
        height: height / 6.5,
        width: width / 4,
    })
})