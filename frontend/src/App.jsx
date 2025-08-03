import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Notification from './components/Notification';
import Navbar from './components/Navbar';
import api from './api';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
  }, [accessToken]);

  return (
    <>
      <Navbar
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Routes>
        <Route path="/login" element={<Login setAccessToken={setAccessToken} />} />
        <Route
          path="/"
          element={
            accessToken ? (
              <Notification
                accessToken={accessToken}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;