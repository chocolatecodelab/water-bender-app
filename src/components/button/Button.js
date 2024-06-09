import React from 'react';
import {
    TouchableOpacity, Text, View, ActivityIndicator,
} from 'react-native';
import {
    COLOR_DISABLED, COLOR_MAIN_SECONDARY, COLOR_SECONDARY_MAIN_ANDROID, COLOR_SECONDARY_MAIN_IOS, COLOR_WHITE, FONT_POPPINS_REGULAR,
} from '../../tools/constant';
import { ios } from '../../tools/helper';

const styles = {
    buttonLoginContainer: {
        backgroundColor: COLOR_MAIN_SECONDARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        height: 45,
        paddingHorizontal: 25,
    },
    disabled: {
        backgroundColor: COLOR_DISABLED,
    },
    textStyle: {
        color: COLOR_WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
};

const enabledButton = (caption, containerStyle, textStyle, onPress) => (
    <TouchableOpacity style={[styles.buttonLoginContainer, containerStyle]} onPress={onPress}>
        <Text style={[styles.textStyle, textStyle]}>
            {caption}
        </Text>
    </TouchableOpacity>
);

const disabledButton = (caption, containerStyle, textStyle) => (
    <View style={[styles.buttonLoginContainer, styles.disabled, containerStyle]}>
        <Text style={[styles.textStyle, textStyle]}>
            {caption}
        </Text>
    </View>
);

const loadingButton = (containerStyle) => (
    <View style={[styles.buttonLoginContainer, containerStyle]}>
        <ActivityIndicator size="large" color={COLOR_WHITE} />
    </View>
);

const Button = ({
    disabled, loading, caption, containerStyle, textStyle, onPress,
}) => {
    if (loading) {
        return loadingButton(containerStyle);
    } if (disabled) {
        return disabledButton(caption, containerStyle, textStyle);
    }
    return enabledButton(caption, containerStyle, textStyle, onPress);
};

export default Button;
