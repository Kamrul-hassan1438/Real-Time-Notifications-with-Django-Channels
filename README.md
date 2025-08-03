Real-Time Notifications with Django and React
A full-stack real-time notification system built with Django, Django Channels, and React.js. The backend uses Django REST Framework with JWT authentication for secure API access and WebSocket for real-time notifications. The frontend is a Vite-powered React.js single-page application (SPA) with a responsive UI for sending and receiving notifications.
Features

Real-Time Notifications: Send and receive notifications instantly via WebSocket using Django Channels.
JWT Authentication: Secure user authentication with access and refresh tokens.
Responsive UI: React.js frontend with Bootstrap for a clean, user-friendly interface.
Notification Dropdown: Displays notifications in a navbar dropdown with an unread count and mark-as-read functionality.
REST API: Backend API for user management and notification sending.
Logging: Comprehensive logging for debugging WebSocket and API interactions.

Tech Stack

Backend:
Django 4.x
Django Channels (WebSocket)
Django REST Framework with SimpleJWT
SQLite (development; supports other databases in production)


Frontend:
React.js 18.x
Vite 5.x
Bootstrap 5.2
Axios for API calls
React Router for navigation


Other: Font Awesome for icons

Prerequisites

Python 3.8+
Node.js 18+
Git
SQLite (included with Django for development)

Project Structure
real-time-notifications/
├── notifi/                  # Django backend
│   ├── myapp/               # Django app for models, views, consumers
│   │   ├── migrations/      # Database migrations
│   │   ├── __init__.py
│   │   ├── admin.py         # Admin panel configuration
│   │   ├── consumers.py     # WebSocket consumer for notifications
│   │   ├── models.py        # Notification model
│   │   ├── routing.py       # WebSocket routing
│   │   ├── signals.py       # Signal handler for notification sending
│   │   ├── urls.py          # URL routes
│   │   └── views.py         # API views for users and notifications
│   ├── notifi/
│   │   ├── __init__.py
│   │   ├── asgi.py          # ASGI configuration for Channels
│   │   ├── settings.py      # Django settings
│   │   └── urls.py          # Project URL configuration
│   └── manage.py
├── frontend/                # Vite/React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx    # Login page
│   │   │   ├── Navbar.jsx   # Navigation bar with notification dropdown
│   │   │   └── Notification.jsx # Notification sending and display
│   │   ├── App.jsx          # Main app with routing
│   │   ├── api.js           # Axios configuration with token refresh
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # React entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── vite.config.js       # Vite configuration
├── .gitignore
└── README.md

Setup Instructions
Backend Setup

Clone the Repository:
git clone https://github.com/Kamrul-hassan1438/Real-Time-Notifications-with-Django-Channels
cd real-time-notifications


Set Up Python Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Backend Dependencies:
cd notifi
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers channels


Apply Migrations:
python manage.py makemigrations
python manage.py migrate


Create a Superuser:
python manage.py createsuperuser


Run the Backend:
python manage.py runserver

The backend will run at http://localhost:8000.


Frontend Setup

Navigate to Frontend Directory:
cd ../frontend


Install Frontend Dependencies:
npm install


Create .env File: In frontend/, create .env:
VITE_API_URL=http://localhost:8000


Run the Frontend:
npm run dev

The frontend will run at http://localhost:5173.


Usage

Access the App:

Open http://localhost:5173/login in a browser.
Log in with a superuser account or create additional users via the admin panel (http://localhost:8000/admin/).


Send Notifications:

After logging in, you’ll be redirected to /.
Select a recipient from the dropdown and enter a message.
Click “Send” to dispatch the notification.


Receive Notifications:

Log in as another user in a different browser or incognito mode.
Notifications appear in the navbar dropdown (bell icon) with an unread count.
Click a notification to mark it as read (it will appear muted, and the count will decrease).


Admin Panel:

Access http://localhost:8000/admin/ to view and manage notifications and users.



API Endpoints

POST /api/token/: Obtain JWT access and refresh tokens.
Request: { "username": "user", "password": "pass" }
Response: { "access": "...", "refresh": "..." }


POST /api/token/refresh/: Refresh the access token using the refresh token (stored in an HttpOnly cookie).
Response: { "access": "..." }


GET /api/users/: Get a list of users (excluding the current user) for the recipient dropdown.
Response: [ { "id": 1, "username": "user1" }, ... ]


POST /api/send_notification/: Send a notification.
Request: { "receiver": 2, "message": "Hello" }
Response: { "message": "Notification sent successfully." }



WebSocket

URL: ws://localhost:8000/ws/notify/?token=<access_token>
Purpose: Delivers real-time notifications to the user’s group (user_<user_id>).
Message Format: { "message": "Hello", "sender": "user1" }

Security

JWT Authentication: Access tokens are stored in memory (React state) for security. Refresh tokens are stored in HttpOnly cookies.
CORS: Configured to allow requests from http://localhost:5173.
WebSocket: Authenticates users via JWT tokens passed in the query string.
CSRF: Enabled for API requests with CORS_ALLOW_CREDENTIALS.

Debugging

Backend Logs: Check the Django console for logs (DEBUG level) in views.py, consumers.py, and signals.py.
Frontend Logs: Open the browser console (F12) to check for WebSocket and API errors.
Database: Use the admin panel (/admin/myapp/notification/) to verify notification creation.

Production Notes

Database: Replace SQLite with PostgreSQL or another production-ready database.
Channel Layer: Use RedisChannelLayer instead of InMemoryChannelLayer for scalability.
WebSocket: Switch to wss:// for secure connections.
Environment Variables: Store SECRET_KEY and other sensitive data in a .env file.
Static Files: Serve React’s production build (npm run build) via Django or a separate server (e.g., Nginx).

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
MIT License.
Contact
For issues or suggestions, open an issue on GitHub or contact mhassan212153@bscse.uiu.ac.bd.