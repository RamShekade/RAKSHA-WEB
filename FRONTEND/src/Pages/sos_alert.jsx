import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";

const SOSAlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // Selected location
  const mapRef = useRef(null); // Ref for the map container
  const mapInstance = useRef(null); // Store the OpenLayers map instance

  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to the server:", socket.id);
    });

    socket.on("alert-userDetails", (data) => {
      console.log("Received alert:", data);
      setAlerts((prevAlerts) => [...prevAlerts, data]);
    });

    return () => {
      socket.disconnect(); // Cleanup socket connection on component unmount
    };
  }, []);

  const initializeMap = (latitude, longitude) => {
    const coordinates = fromLonLat([longitude, latitude]); // Convert lat/lon to Web Mercator
    if (!mapInstance.current) {
      // Initialize the map only once
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(), // OpenStreetMap base layer
          }),
        ],
        view: new View({
          center: coordinates,
          zoom: 15, // Close zoom level to mark the exact location
        }),
      });
    } else {
      // Update the map view to the new location
      mapInstance.current.getView().setCenter(coordinates);
      mapInstance.current.getView().setZoom(15);
    }

    // Create a marker for the exact location
    const marker = new Feature({
      geometry: new Point(coordinates),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg", // Marker icon
          scale: 1, // Adjust the marker size
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker],
      }),
    });

    // Remove existing vector layers to avoid duplicates
    mapInstance.current.getLayers().forEach((layer) => {
      if (layer instanceof VectorLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add the new vector layer with the marker
    mapInstance.current.addLayer(vectorLayer);
  };

  const handleTrackLocation = (latitude, longitude) => {
    setSelectedLocation({ latitude, longitude });
    setTimeout(() => {
      initializeMap(latitude, longitude); // Initialize the map after rendering the container
    }, 0);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "red" }}>SOS Alerts</h1>
      {alerts.length === 0 ? (
        <p>No alerts received yet.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {alerts.map((alert, index) => (
            <li
              key={index}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "black",
                color: "white",
              }}
            >
              <strong>User:</strong> {alert.username || "Unknown"}
              <br />
              <strong>Location:</strong> Latitude: {alert.latitude}, Longitude: {alert.longitude}
              <br />
              <strong>Details:</strong> {alert.details?.name || "N/A"} ({alert.details?.mobileNo || "N/A"})
              <br />
              <button
                onClick={() => handleTrackLocation(alert.latitude, alert.longitude)}
                style={{
                  marginTop: "10px",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Track Location
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedLocation && (
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "400px",
            marginTop: "20px",
            border: "1px solid #ddd",
          }}
        />
      )}
    </div>
  );
};

export default SOSAlertPage;
