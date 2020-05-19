import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';

// Screens
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import RatingScreen from './components/RatingScreen';

import reducer from './redux/reducers';
import initialState from './redux/reducers/initialState.json';
import AlertBox from './components/AlertBox';

console.disableYellowBox = true;

const Stack = createStackNavigator();

let store;

export default () => {
  const [loading, setLoading] = useState(true);
  const [initialRegion, setInitialRegion] = useState();

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(status => {
          if (status) {
            Geolocation.getCurrentPosition(geo_success => {
              console.log('Success', geo_success);

              resolve(geo_success.coords);
            });
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
              .then(status => {
                if (status) {
                  Geolocation.getCurrentPosition(geo_success => {
                    console.log('Success', geo_success);

                    resolve(geo_success.coords);
                  });
                }
              })
              .catch(err =>
                console.log('Error while requesting location permission', err),
              );
          }
        })
        .catch(err =>
          console.log('Error while requesting location permission', err),
        );
    });
  };

  const getNearbyPlaces = coords => {
    fetch(
      'https://europe-west3-isitsafe-276523.cloudfunctions.net/getPlaceDetails',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          placeTypes: ['restaurant'],
        }),
      },
    )
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.status === 'ok') {
          store = createStore(reducer, {
            ratings: [],
            places: jsonResponse.places,
          });

          store.subscribe(() =>
            console.log(JSON.stringify(store.getState(), null, 2)),
          );

          setInitialRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
          setLoading(false);
        }
      })
      .catch(err => console.log('Network error: ', err));
  };

  useEffect(() => {
    getLocation()
      .then(getNearbyPlaces)
      .catch(console.log);
  }, []);

  return loading ? null : (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='HomeScreen'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name='HomeScreen'>
            {props => <HomeScreen {...props} initialRegion={initialRegion} />}
          </Stack.Screen>
          <Stack.Screen name='AuthScreen' component={AuthScreen} />
          <Stack.Screen name='RatingScreen' component={RatingScreen} />
          <Stack.Screen name='AlertBox' component={AlertBox} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
