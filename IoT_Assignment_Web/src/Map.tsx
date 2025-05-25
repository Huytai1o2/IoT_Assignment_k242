import React from "react";
import GoogleMapReact from 'google-map-react';
import { Link } from "react-router-dom";

const Marker = ({ text, deviceId }: { text: string; deviceId: number; lat?: number; lng?: number }) => (
  <Link
    to={`/device/${deviceId}`}
    style={{
      textDecoration: 'none',
      color: 'inherit'
    }}
  >
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transform: 'translate(-50%, -100%)',
      cursor: 'pointer'
    }}>
      <span style={{ fontSize: '2rem' }}>📍</span>
      <span style={{
        background: 'white',
        color: 'black',
        padding: '8px 18px',
        borderRadius: '8px',
        fontSize: '16px',
        marginTop: '4px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.2)',
        minWidth: '60px',
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>
        {text}
      </span>
    </div>
  </Link>
);

export default function Map() {
  // Device locations
  const devices = [
    {
      lat: 10.7733892, // Device 1: HCMUT, District 10
      lng: 106.6607066,
      text: "Device 1",
      deviceId: 1
    },
    {
      lat: 10.8805585, // Device 2: HCMUT, Binh Duong
      lng: 106.8053863,
      text: "Device 2",
      deviceId: 2
    }
  ];

  // Tính tọa độ trung bình
  const avgLat = (devices[0].lat + devices[1].lat) / 2;
  const avgLng = (devices[0].lng + devices[1].lng) / 2;

  const defaultProps = {
    center: {
      lat: avgLat,
      lng: avgLng
    },
    zoom: 11
  };

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#f5f5f5' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }} // Add your Google Maps API key here
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {devices.map((device, idx) => (
          <Marker
            key={idx}
            lat={device.lat}
            lng={device.lng}
            text={device.text}
            deviceId={device.deviceId}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}