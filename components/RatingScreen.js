import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';

const rules = [
  { name: 'Οι εργαζόμενοι φοράνε γάντια', value: 25 },
  { name: 'Οι εργαζόμενοι φοράνε μάσκα', value: 50 },
  { name: 'Υπάρχει απόσταση 1 μέτρου μεταξύ τω τραπεζιών', value: 45 },
];

const ListItem = ({ name, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);

  const changeValueBasedOnInput = input => {
    if (typeof input === 'number') {
      if (input > 100) setValue(100);
      else if (input < 0) setValue(0);
      else setValue(input);
    }
  };

  return (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{name}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={value}
          onValueChange={_value => setValue(_value)}
          step={1}
          thumbTintColor='#2196f3'
          minimumTrackTintColor='#2196f3'
          maximumTrackTintColor='#2196f3'
        />
        <TextInput
          style={styles.itemInput}
          value={value.toString()}
          onChangeText={changeValueBasedOnInput}
        />
      </View>
    </View>
  );
};

export default () => {
  return (
    <View style={styles.ratingScreen}>
      <Text style={styles.headerText}>
        {'Help us determine\nthe safety of this place'}
      </Text>
      <FlatList
        style={styles.flatList}
        data={rules}
        renderItem={({ item }) => (
          <ListItem name={item.name} defaultValue={item.value} />
        )}
        keyExtractor={(_, i) => i.toString()}
      />
      <TouchableOpacity style={styles.button} activeOpacity={0.4}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingScreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    alignSelf: 'flex-start',
    color: '#2196f3',
    fontFamily: 'poppins_semibold',
    fontSize: 25,
    marginTop: 32,
    marginLeft: 16,
  },
  flatList: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 5,
  },
  listItem: {
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  slider: {
    width: '80%',
  },
  itemText: {
    fontFamily: 'poppins_regular',
    fontSize: 16,
  },
  itemInput: {
    width: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingVertical: 0,
    textAlign: 'center',
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#2196f3',
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 5,
  },
  buttonText: {
    color: '#f5f5f5',
    fontFamily: 'poppins_regular',
    fontSize: 15,
  },
});
