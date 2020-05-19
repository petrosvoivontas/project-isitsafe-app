import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';

// const rules = [
//   { name: 'Οι εργαζόμενοι φοράνε γάντια', value: 25 },
//   { name: 'Οι εργαζόμενοι φοράνε μάσκα', value: 50 },
//   { name: 'Υπάρχει απόσταση 1 μέτρου μεταξύ τω τραπεζιών', value: 45 },
// ];

const OptionBox = ({ value, active = false, onIsActiveChange }) => {
  const [isActive, setIsActive] = useState(active);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsActive(!isActive);
          onIsActiveChange(isActive);
        }}
      >
        <Text>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

const ListItem = ({ name, defaultValue, maxValue }) => {
  const [value, setValue] = useState(Math.round(defaultValue / 25));
  console.log(maxValue);

  const twoOptions = (
    <View style={styles.listItem}>
      <Text>{name}</Text>
      <View style={styles.listItemOptionsView}>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(1)}
        >
          <Text>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(0)}
        >
          <Text>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const fiveOptions = (
    <View style={styles.listItem}>
      <Text>{name}</Text>
      <View style={styles.listItemOptionsView}>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(0)}
        >
          <Text>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(1)}
        >
          <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(2)}
        >
          <Text>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(3)}
        >
          <Text>3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listItemOption}
          onPress={() => setValue(4)}
        >
          <Text>4</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return maxValue === 1 ? twoOptions : fiveOptions;
};

export default ({
  navigation,
  route: {
    params: { placeId, placeType },
  },
}) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingSchema, setRatingSchema] = useState();

  const getPlaceRating = () => {
    fetch(
      `https://europe-west3-isitsafe-276523.cloudfunctions.net/getPlaceRating?placeId=${placeId}&placeType=${placeType}`,
    )
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(
        jsonResponse => {
          console.log('jsonResponse: ', jsonResponse);
          const placeRating = jsonResponse.placeRating;
          const ratingSchema = jsonResponse.ratingSchema;

          if (jsonResponse.status === 'ok') {
            let rules = [];

            for (let rule in placeRating.rules) {
              rules.push({
                name: rule,
                value: placeRating.rules[rule],
                maxValue: ratingSchema[rule],
              });
            }

            setRules(rules);
            setRatingSchema(jsonResponse.ratingSchema);
            setLoading(false);
          } else navigation.goBack();
        },
        err => console.log('Another error: ', err),
      )
      .catch(err => {
        console.log('Network error: ', err);
        navigation.goBack();
      });
  };

  useEffect(() => {
    getPlaceRating();
  }, []);

  return loading ? null : (
    <View style={styles.ratingScreen}>
      <Text style={styles.headerText}>
        {'Help us determine\nthe safety of this place'}
      </Text>
      <FlatList
        style={styles.flatList}
        data={rules}
        renderItem={({ item }) => <ListItem {...item} />}
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
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 5,
  },
  listItem: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  listItemOptionsView: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 16,
  },
  listItemOption: {
    borderColor: '#cbc9c9',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  itemText: {
    fontFamily: 'poppins_regular',
    fontSize: 16,
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
