import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 12.9716,
  lng: 77.5946,
};

export function Map({ pickup, dropoff, onPickupSelect, onDropoffSelect }) {
  const [map, setMap] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4F46E5',
          strokeWeight: 5,
        },
      });

      if (map) {
        directionsRendererRef.current.setMap(map);
      }
    }
  }, [map]);

  useEffect(() => {
    if (
      pickup?.coordinates &&
      dropoff?.coordinates &&
      directionsServiceRef.current
    ) {
      const origin = new window.google.maps.LatLng(
        pickup.coordinates.lat,
        pickup.coordinates.lng
      );
      const destination = new window.google.maps.LatLng(
        dropoff.coordinates.lat,
        dropoff.coordinates.lng
      );

      directionsServiceRef.current.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRendererRef.current.setDirections(result);
            const route = result.routes[0].legs[0];
            setRouteInfo({
              distance: route.distance.text,
              duration: route.duration.text,
            });
          }
        }
      );
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    if (window.google) {
      pickupAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        document.getElementById('pickup'),
        { types: ['geocode'] }
      );
      dropoffAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        document.getElementById('dropoff'),
        { types: ['geocode'] }
      );

      pickupAutocompleteRef.current.addListener('place_changed', () => {
        const place = pickupAutocompleteRef.current.getPlace();
        if (place.geometry) {
          onPickupSelect({
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          });
        }
      });

      dropoffAutocompleteRef.current.addListener('place_changed', () => {
        const place = dropoffAutocompleteRef.current.getPlace();
        if (place.geometry) {
          onDropoffSelect({
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          });
        }
      });
    }
  }, [onPickupSelect, onDropoffSelect]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Location
        </label>
        <input
          type="text"
          id="pickup"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter pickup location"
        />
      </div>
      <div>
        <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700 mb-1">
          Dropoff Location
        </label>
        <input
          type="text"
          id="dropoff"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter dropoff location"
        />
      </div>

      {routeInfo && (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-indigo-800">Distance</p>
              <p className="text-lg font-semibold text-indigo-900">{routeInfo.distance}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-800">Estimated Time</p>
              <p className="text-lg font-semibold text-indigo-900">{routeInfo.duration}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {pickup?.coordinates && (
            <Marker position={pickup.coordinates} label="P" />
          )}
          {dropoff?.coordinates && (
            <Marker position={dropoff.coordinates} label="D" />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}