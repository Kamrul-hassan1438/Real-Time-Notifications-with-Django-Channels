from django.contrib import admin
from django.urls import path, include
from myapp import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', views.get_users, name='get_users'),
    path('api/send_notification/', views.send_notification, name='send_notification'),
]