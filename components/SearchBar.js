import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
} from 'react-native';

export default ({ getReference }) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');

  return focused ? (
    <View style={styles.active}>
      <TextInput
        ref={ref => getReference(ref)}
        placeholder='Type here'
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 0.91,
          fontFamily: 'poppins_semibold',
          fontSize: 14,
          color: '#2196f399',
          marginLeft: 16,
        }}
      />
      <TouchableOpacity>
        <Text
          style={{
            fontFamily: 'poppins_light',
            fontSize: 16,
            color: '#2196f3',
          }}
        >
          Search
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.inactive}>
      <TextInput
        placeholder='Type here'
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        style={{
          fontFamily: 'poppins_semibold',
          fontSize: 14,
          color: '#2196f399',
          marginLeft: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inactive: {
    backgroundColor: '#ffffff',
    height: 46,
    // marginTop: -71,
    borderRadius: 25,
    marginTop: Dimensions.get('window').height - 170,
    // position: 'absolute',
    // bottom: 25,
    // left: 20,
    // right: 20,
    elevation: 3, // the only option for shadows in android
  },
  active: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 46,
    paddingRight: 24,
    // paddingLeft: 16,
    borderRadius: 25,
    elevation: 3,
    marginTop: Dimensions.get('window').height - 170,
    // position: 'absolute',
    // bottom: 25,
    // left: 20,
    // right: 20,
  },
});
