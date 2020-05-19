import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default ({
  navigation,
  route: {
    params: { title, text },
  },
}) => {
  return (
    <View style={styles.parent}>
      <View style={styles.alert}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={navigation.goBack}
          activeOpacity={0.4}
        >
          <Text style={styles.buttonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    ...StyleSheet.absoluteFillObject,
    left: 50,
    right: 50,
    top: 325,
    bottom: 325,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  alertText: {},
  title: {
    fontFamily: 'poppins_semibold',
    color: '#2196f3',
    fontSize: 24,
    textAlign: 'center',
  },
  text: {
    marginTop: 8,
    paddingHorizontal: 40,
    fontFamily: 'poppins_regular',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 5,
  },
  buttonText: {
    fontFamily: 'poppins_regular',
    color: '#f5f5f5',
    textAlign: 'center',
  },
});
