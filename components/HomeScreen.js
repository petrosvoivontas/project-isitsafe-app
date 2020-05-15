import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Carousel from 'react-native-snap-carousel';

import SearchBar from './SearchBar';
import Header from './Header';
import mapStyle from '../map.json';

const Home = ({ navigation, places }) => {
  let textInput,
    inputActive = false,
    map,
    carousel,
    markers = [];

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

  const renderCarouselItem = ({ item: { name, address } }) => {
    return (
      <View style={styles.carouselItem}>
        <View style={styles.carouselItemTextView}>
          <Text style={styles.carouselItemName}>{name}</Text>
          <Text style={styles.carouselItemAddress}>{address}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.4}>
          <Text style={styles.carouselItemButtonText}>Is It Safe?</Text>
        </TouchableOpacity>
      </View>
    );
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
        onMapReady={() => {
          map.animateCamera({ center: { ...places[0].location } });
          markers[0].showCallout();
          carousel.snapToItem(0);
        }}
      >
        {places.map((place, i) => {
          return (
            <Marker
              ref={ref => markers.push(ref)}
              key={place.placeId}
              coordinate={place.location}
              title={place.name}
              onPress={() => carousel.snapToItem(i)}
            />
          );
        })}
      </MapView>
      {/* <View style={styles.overlay}>
        <Header navigation={navigation} />
        <SearchBar
          getReference={ref => {
            textInput = ref;
            inputActive = true;
          }}
        />
      </View> */}
      <View style={styles.overlay}>
        <Header navigation={navigation} />
        <Carousel
          ref={ref => (carousel = ref)}
          data={places}
          renderItem={renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          containerCustomStyle={styles.carousel}
          enableMomentum={true}
          onSnapToItem={index => {
            map.animateCamera({ center: { ...places[index].location } });
            markers[index].showCallout();
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
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 16,
  },
  carouselItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 8,
  },
  carouselItemTextView: {
    marginLeft: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  carouselItemName: {
    fontSize: 16,
    fontFamily: 'poppins_semibold',
  },
  carouselItemButtonText: {
    fontFamily: 'poppins_semibold',
    fontSize: 24,
    color: '#2196f3',
  },
});

// TODO: state must be immutable
const mapStateToProps = state => {
  let places = state.places;

  places = places.map(place => ({
    location: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    name: place.name,
    placeId: place.place_id,
    // open: place.opening_hours.open_now, // TODO:
    address: place.vicinity,
  }));

  return { places };
};

export default connect(mapStateToProps)(Home);
