import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Home from './components/Home';
import reducer from './redux/reducers';
import initialState from './redux/reducers/initialState.json';

const store = createStore(reducer, {
  ratings: [],
  places: initialState.results,
});
store.subscribe(() => {
  console.log(JSON.stringify(store.getState(), null, 2));
});

export default () => (
  <Provider store={store}>
    <Home />
  </Provider>
);
