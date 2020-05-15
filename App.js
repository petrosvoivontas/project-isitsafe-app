import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Screens
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import RatingScreen from './components/RatingScreen';

import reducer from './redux/reducers';
import initialState from './redux/reducers/initialState.json';

const Stack = createStackNavigator();

const store = createStore(reducer, {
  ratings: [],
  places: initialState.results,
});
store.subscribe(() => {
  console.log(JSON.stringify(store.getState(), null, 2));
});

export default () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='HomeScreen'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='AuthScreen' component={AuthScreen} />
        <Stack.Screen name='RatingScreen' component={RatingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);
