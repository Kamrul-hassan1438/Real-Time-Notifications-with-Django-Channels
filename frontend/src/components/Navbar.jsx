import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ accessToken, setAccessToken, notifications, setNotifications }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setAccessToken(null);
    setNotifications([]);
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    navigate('/login');
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Notify</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {accessToken ? (
              <li className="nav-item">
                <button className="nav-link btn" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
          {accessToken && (
            <div className="d-flex dropstart">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                  >
                    <i id="bellCount" className="fa-solid fa-bell" data-count={unreadCount || 0}></i>
                  </a>
                  <ul
                    className={`dropdown-menu dropdown-menu-dark text-wrap ${isDropdownOpen ? 'show' : ''}`}
                    style={{ width: '300px' }}
                  >
                    {notifications.length === 0 && (
                      <li>
                        <a className="dropdown-item text-wrap" href="#">No notifications</a>
                      </li>
                    )}
                    {notifications.map((notif) => (
                      <li key={notif.id}>
                        <a
                          className={`dropdown-item text-wrap ${notif.read ? 'text-muted' : ''}`}
                          href="#"
                          onClick={() => markAsRead(notif.id)}
                        >
                          {notif.sender}: {notif.message}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;