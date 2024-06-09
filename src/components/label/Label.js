import React from 'react';
import { Text } from 'react-native';
import { COLOR_BLACK } from '../../tools/constant';

const styles = {
  textStyle: {
    color: COLOR_BLACK,
  },
};

const Label = ({
  fontSize, bold, italic, underline, style, children,
}) => (
  <Text
    style={[
      styles.textStyle,
      fontSize ? { fontSize } : {},
      { fontWeight: bold ? 'bold' : 'normal' },
      { fontStyle: italic ? 'italic' : 'normal' },
      { textDecorationLine: underline ? 'underline' : 'none' },
      style,
    ]}
    allowFontScaling={false}
  >
    {children}
  </Text>
);

export default Label;

