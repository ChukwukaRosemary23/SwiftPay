import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { atmLocations } from '../data/mockData';

export default function ATMFinderScreen({ navigation }: any) {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedATM, setSelectedATM] = useState<any>(null);
  const [nearestATMs, setNearestATMs] = useState<any[]>([]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find nearby ATMs',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Calculate distances and find nearest ATMs
      const atmsWithDistance = atmLocations.map(atm => ({
        ...atm,
        distance: calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          atm.latitude,
          atm.longitude
        ),
      }));

      // Sort by distance and get top 5
      const sorted = atmsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 5);
      setNearestATMs(sorted);
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please try again.');
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const openDirections = (atm: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${atm.latitude},${atm.longitude}`;
    Linking.openURL(url);
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="location" size={64} color="#4F46E5" />
        <Text style={styles.loadingText}>Getting your location...</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getUserLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find ATMs</Text>
        <TouchableOpacity onPress={getUserLocation}>
          <Ionicons name="refresh" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="Your Location"
          pinColor="#4F46E5"
        />

        {/* ATM markers */}
        {atmLocations.map((atm) => (
          <Marker
            key={atm.id}
            coordinate={{
              latitude: atm.latitude,
              longitude: atm.longitude,
            }}
            title={atm.name}
            description={atm.address}
            onPress={() => setSelectedATM(atm)}
          >
            <View style={styles.markerContainer}>
              <Ionicons
                name={atm.type === 'ATM' ? 'cash' : 'business'}
                size={24}
                color="#FFFFFF"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Nearest ATMs List */}
      <View style={styles.atmListContainer}>
        <Text style={styles.atmListTitle}>Nearest ATMs</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nearestATMs.map((atm) => (
            <TouchableOpacity
              key={atm.id}
              style={styles.atmCard}
              onPress={() => setSelectedATM(atm)}
            >
              <View style={styles.atmCardHeader}>
                <Ionicons
                  name={atm.type === 'ATM' ? 'cash' : 'business'}
                  size={24}
                  color="#4F46E5"
                />
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>
                    {atm.distance.toFixed(1)} km
                  </Text>
                </View>
              </View>
              <Text style={styles.atmName}>{atm.bank}</Text>
              <Text style={styles.atmType}>{atm.type}</Text>
              <Text style={styles.atmAddress} numberOfLines={1}>
                {atm.address}
              </Text>
              {atm.available24_7 && (
                <View style={styles.badge24}>
                  <Text style={styles.badge24Text}>24/7</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected ATM Details */}
      {selectedATM && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailsName}>{selectedATM.name}</Text>
              <Text style={styles.detailsAddress}>{selectedATM.address}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedATM(null)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color="#6B7280" />
              <Text style={styles.infoText}>
                {selectedATM.available24_7 ? '24/7 Available' : 'Business Hours Only'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="pricetag" size={20} color="#6B7280" />
              <Text style={styles.infoText}>{selectedATM.type}</Text>
            </View>
          </View>

          <Text style={styles.servicesTitle}>Services:</Text>
          <View style={styles.servicesList}>
            {selectedATM.services.map((service: string, index: number) => (
              <View key={index} style={styles.serviceChip}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => openDirections(selectedATM)}
          >
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  atmListContainer: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  atmListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 24,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  atmCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  atmCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceBadge: {
    backgroundColor: '#4F46E520',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  atmName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  atmType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  atmAddress: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badge24: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badge24Text: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailsName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  detailsAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  serviceChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 12,
    color: '#4B5563',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  directionsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});