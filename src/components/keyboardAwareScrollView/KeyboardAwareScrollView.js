import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const KeyboardView = ({ children, ...props }) => (
  <KeyboardAwareScrollView
    showsVerticalScrollIndicator={false}
    {...props}
  >
    {children}
  </KeyboardAwareScrollView>
);

export default KeyboardView;

KeyboardView.propTypes = {
  children: PropTypes.node.isRequired,
};
