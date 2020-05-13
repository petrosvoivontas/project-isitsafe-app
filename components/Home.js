import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import SearchBar from './SearchBar';
import Header from './Header';
import mapStyle from '../map.json';

const Home = ({ places }) => {
  let textInput, isActive, map;
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(status => {
        if (status) {
          Geolocation.getCurrentPosition(geo_success => {
            console.log('Success', geo_success);
            setRegion({
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
                setRegion({
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

  const searchPlace = (latitude, longitude) => {
    return fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyB8cy3I1XRvZNU9z1uSQcqk4VQNd8rOpr4`,
      {
        method: 'GET',
      },
    );
  };

  useEffect(() => {
    getLocation().then(res => {
      console.log(res);
      const latitude = res.latitudel;
      const longitude = res.longitude;

      // fetch(
      //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=AIzaSyB8cy3I1XRvZNU9z1uSQcqk4VQNd8rOpr4`,
      //   {
      //     method: 'GET',
      //   },
      // )
      //   .then(res => res.json())
      //   .then(jsonResponse =>
      //     console.log(JSON.stringify(jsonResponse, null, 2)),
      //   );
    });

    return () => {};
  }, [map]);

  return (
    <View style={styles.home}>
      <MapView
        ref={node => (map = node)}
        style={{ height: '100%' }}
        onTouchStart={() => {
          if (isActive) {
            textInput.blur();
            isActive = false;
          }
        }}
        customMapStyle={mapStyle}
        region={region}
        onMapReady={() => {
          map.animateCamera({ center: { ...places[0].location } });
        }}
        onRegionChangeComplete={region => setRegion(region)}
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
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 30,
          left: 20,
          right: 20,
          // paddingTop: 20,
          // paddingBottom: 100,
          // height: Dimensions.get('screen').height,
        }}
      >
        <Header />
        <SearchBar
          getReference={ref => {
            if (ref) {
              textInput = ref;
              isActive = true;
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'flex-start',
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
