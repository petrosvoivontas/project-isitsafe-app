import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Avatar from '../assets/avatar.svg';

export default () => {
  return (
    <View style={styles.header}>
      <Avatar width={60} height={60} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
  },
});
