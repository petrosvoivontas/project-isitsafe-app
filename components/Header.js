import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Avatar from '../assets/philosopher.svg';

export default () => {
  return (
    <View style={styles.header}>
      <Avatar width={35} height={35} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 25,
    marginRight: 25,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    elevation: 5,
  },
});
