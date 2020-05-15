import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import SearchBar from './SearchBar';
import Header from './Header';
import mapStyle from '../map.json';

const Home = ({ navigation, places }) => {
  let textInput,
    inputActive = false,
    map;

  const [initialRegion, setInitialRegion] = useState({});

  const [loading, setLoading] = useState(true);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(status => {
        if (status) {
          Geolocation.getCurrentPosition(geo_success => {
            console.log('Success', geo_success);

            setInitialRegion({
              latitude: geo_success.coords.latitude,
              longitude: geo_success.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });

            resolve(geo_success.coords);
          });
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(status => {
            if (status) {
              Geolocation.getCurrentPosition(geo_success => {
                console.log('Success', geo_success);
                setInitialRegion({
                  latitude: geo_success.coords.latitude,
                  longitude: geo_success.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
              });

              resolve(geo_success.coords);
            }
          });
        }
      });
    });
  };

  useEffect(() => {
    getLocation().then(res => {
      if (initialRegion) setLoading(false);
    });

    return () => {};
  }, []);

  return loading ? null : (
    <View style={styles.home}>
      <MapView
        style={styles.map}
        ref={ref => (map = ref)}
        onTouchStart={() => {
          if (inputActive) {
            if (textInput) textInput.blur();
            inputActive = false;
          }
        }}
        customMapStyle={mapStyle}
        initialRegion={initialRegion}
        onMapReady={() =>
          map.animateCamera({ center: { ...places[0].location } })
        }
      >
        {places.map(place => {
          return (
            <Marker
              key={place.placeId}
              coordinate={place.location}
              title={place.name}
            />
          );
        })}
      </MapView>
      <View style={styles.overlay}>
        <Header navigation={navigation} />
        <SearchBar
          getReference={ref => {
            textInput = ref;
            inputActive = true;
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  let places = state.places;

  places = places.map(place => ({
    location: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    name: place.name,
    placeId: place.place_id,
  }));

  return { places };
};

export default connect(mapStateToProps)(Home);
