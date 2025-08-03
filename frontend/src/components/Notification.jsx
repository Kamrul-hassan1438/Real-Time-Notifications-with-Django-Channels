import { useState, useEffect, useRef } from 'react';
import api from '../api';

function Notification({ accessToken, setNotifications, notifications }) {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users/');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();

    // WebSocket connection with reconnection
    const connectWebSocket = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        return;
      }

      wsRef.current = new WebSocket(`ws://localhost:8000/ws/notify/?token=${accessToken}`);
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
      };
      wsRef.current.onmessage = (e) => {
        console.log('Received WebSocket message:', e.data);
        const data = JSON.parse(e.data);
        setNotifications((prev) => [
          ...prev,
          { sender: data.sender, message: data.message, id: Date.now(), read: false }
        ]);
      };
      wsRef.current.onerror = (e) => {
        console.error('WebSocket error:', e);
      };
      wsRef.current.onclose = (e) => {
        console.log('WebSocket closed, attempting to reconnect in 3 seconds...', e);
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [accessToken, setNotifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/api/send_notification/', {
        receiver: receiverId,
        message,
      });
      setSuccess(response.data.message);
      setMessage('');
      setReceiverId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send notification');
      console.error('Send notification error:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Welcome to Notify</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3>Send Notification</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="receiver" className="form-label">Select Recipient</label>
              <select
                className="form-select"
                id="receiver"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                required
              >
                <option value="" disabled>Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Notification;