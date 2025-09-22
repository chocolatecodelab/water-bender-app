/**
 * Login Screen Component
 * 
 * Main authentication screen for water monitoring application.
 * Provides secure user login functionality with comprehensive validation,
 * responsive design for multiple device types, and enhanced user experience.
 * 
 * Features:
 * - Secure username/password authentication
 * - Real-time input validation with error feedback
 * - Responsive design (phone/tablet optimized)
 * - Password visibility toggle
 * - Loading states and disabled interactions
 * - Navigation to registration and password recovery
 * - Corporate branding integration
 * 
 * Security Features:
 * - Input sanitization and validation
 * - Secure password handling
 * - Error state management
 * - Auto-navigation on successful authentication
 * 
 * @file src/screens/login/Login.js
 * @version 1.0.0
 * @author Water Monitoring Team
 */

// ===== CORE REACT IMPORTS =====
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Pressable, View, Image, ImageBackground } from 'react-native';
import { TextInput } from 'react-native-paper';

// ===== CUSTOM COMPONENT IMPORTS =====
import { 
  Button, 
  KeyboardView, 
  BaseScreen, 
  MyModalError, 
  BodyExtraSmall, 
  Body, 
  BodySmall 
} from "../../components";

// ===== UTILITY IMPORTS =====
import { 
  COLOR_BLACK, 
  COLOR_BLUE, 
  COLOR_DISABLED, 
  COLOR_MAIN_SECONDARY, 
  COLOR_PRIMARY, 
  COLOR_WHITE, 
  COLOR_RED 
} from '../../tools/constant';
import { android, getScreenDimension, iPad } from "../../tools/helper";


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
        console.log('🔄 Login state changed:', { isSuccess, isError, isLoading });
        if (isSuccess === true) {
            console.log('✅ Login success detected, triggering navigation...');
            // Small delay to ensure state is properly updated
            setTimeout(() => {
                onNavigationDashboard()
            }, 100);
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
                            {/* Username Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode='outlined'
                                    label="Username"
                                    value={username}
                                    onChangeText={(text) => {
                                        setErrorUsername(null)
                                        onChangeUsername(text)
                                    }}
                                    cursorColor={COLOR_PRIMARY}
                                    outlineColor={errorUsername ? COLOR_RED : COLOR_DISABLED}
                                    activeOutlineColor={errorUsername ? COLOR_RED : COLOR_PRIMARY}
                                    editable={!isLoading}
                                    error={!!errorUsername}
                                    style={{
                                        backgroundColor: COLOR_WHITE,
                                        marginBottom: 5,
                                        paddingHorizontal: iPad ? 15 : 10,
                                    }}
                                    theme={{ roundness: 50 }}
                                    right={
                                        <TextInput.Icon
                                            icon={'account'}
                                            color={errorUsername ? COLOR_RED : COLOR_DISABLED}
                                            size={iPad ? 30 : 24}
                                        />
                                    }
                                    autoCapitalize='none'
                                    placeholder="Enter your username"
                                    textContentType="username"
                                    autoComplete="username"
                                />
                                {errorUsername && (
                                    <Text style={styles.errorText}>{errorUsername}</Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode='outlined'
                                    label="Password"
                                    value={password}
                                    onChangeText={(text) => {
                                        setErrorPassword(null)
                                        onChangePassword(text)
                                    }}
                                    cursorColor={COLOR_PRIMARY}
                                    outlineColor={errorPassword ? COLOR_RED : COLOR_DISABLED}
                                    activeOutlineColor={errorPassword ? COLOR_RED : COLOR_PRIMARY}
                                    editable={!isLoading}
                                    error={!!errorPassword}
                                    style={{
                                        backgroundColor: COLOR_WHITE,
                                        marginBottom: 5,
                                        paddingHorizontal: iPad ? 15 : 10,
                                    }}
                                    theme={{ roundness: 50 }}
                                    right={
                                        <TextInput.Icon
                                            icon={iconPasssword}
                                            color={errorPassword ? COLOR_RED : COLOR_DISABLED}
                                            size={iPad ? 30 : 24}
                                            onPress={() => handlerVisiblePassword()}
                                        />
                                    }
                                    secureTextEntry={showPassword}
                                    autoCapitalize='none'
                                    placeholder="Enter your password"
                                    textContentType="password"
                                    autoComplete="password"
                                />
                                {errorPassword && (
                                    <Text style={styles.errorText}>{errorPassword}</Text>
                                )}
                            </View>
                            {/* Forgot Password Link */}
                            <Pressable
                                onPress={onNavigationForgetPassword}
                                style={{ alignSelf: 'flex-end', marginBottom: iPad ? 10 : 8, marginTop: 5 }}
                            >
                                {iPad ?
                                    <Body style={styles.secondText(android)}>Forgot Password?</Body> :
                                    <BodySmall style={styles.secondText(android)}>Forgot Password?</BodySmall>
                                }
                            </Pressable>

                            {/* Login Button */}
                            <Button
                                containerStyle={{ 
                                    marginTop: iPad ? 5 : 2, 
                                    borderRadius: 30,
                                    opacity: (!username?.trim() || !password || isLoading) ? 0.6 : 1
                                }}
                                caption={isLoading ? 'Signing In...' : 'Sign In'}
                                disabled={!username?.trim() || !password || isLoading}
                                loading={isLoading}
                                onPress={() => onSubmitPressed(username, password, setErrorPassword, setErrorUsername)}
                            />

                            {/* Login Helper Text */}
                            <View style={styles.helperTextContainer}>
                                <Text style={styles.helperText}>
                                    {(!username?.trim() && !password) ? 'Enter your credentials to continue' :
                                     !username?.trim() ? 'Username is required' :
                                     !password ? 'Password is required' :
                                     'Ready to sign in'}
                                </Text>
                            </View>
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
        marginTop: iPad ? 5 : 3,
        marginBottom: android ? 15 : 8
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
    }),
    inputContainer: {
        marginBottom: iPad ? 12 : 8,
    },
    errorText: {
        color: COLOR_RED,
        fontSize: 12,
        marginLeft: 15,
        marginTop: 5,
        fontWeight: '500'
    },
    helperTextContainer: {
        alignItems: 'center',
        marginTop: iPad ? 8 : 6,
        marginBottom: iPad ? 15 : 12,
    },
    helperText: {
        fontSize: 12,
        color: COLOR_DISABLED,
        textAlign: 'center',
        fontStyle: 'italic'
    }
})