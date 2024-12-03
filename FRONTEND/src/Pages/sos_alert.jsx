import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOSAlertPage = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Connect to the Socket.io server
    const socket = io("http://localhost:3000");

    // Listen for incoming SOS alerts
    socket.on('connect', () => {
        console.log('Connected to the server:', socket.id);
      });
  
      socket.on('alert-userDetails', (data) => {
        console.log('Received alert:', data);
        setAlerts((prevAlerts) => [...prevAlerts, data]);
      });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

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
              }}
            >
              <strong>User:</strong> {alert.username || "Unknown"}
              <br />
              <strong>Location:</strong> Latitude: {alert.latitude}, Longitude: {alert.longitude}
              <br />
              <strong>Details:</strong> {alert.details?.name || "N/A"} ({alert.details?.mobileNo || "N/A"})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default SOSAlertPage;
