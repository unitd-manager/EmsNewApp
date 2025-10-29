// Library Imports
import React from 'react';
import {KeyboardAvoidingView, ScrollView} from 'react-native';

// Local Imports
import {isIOS, moderateScale} from '../../common/constants';
import {styles} from '../../themes';

// KeyboardAvoidWrapper Component
export default KeyBoardAvoidWrapper = ({
  children,
  containerStyle,
  contentContainerStyle,
  // allow override if a screen wants a custom offset
  keyboardVerticalOffset,
}) => {
  // Provide a numeric offset for both platforms. If caller passed a number, use it.
  const offset = typeof keyboardVerticalOffset === 'number' ? keyboardVerticalOffset : moderateScale(50);

  // Use 'padding' on both platforms — it's generally more reliable across nested views and backgrounds.
  const behavior = 'padding';

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={offset}
      style={[styles.flex, containerStyle]}
      behavior={behavior}
      enabled>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}
        bounces={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
