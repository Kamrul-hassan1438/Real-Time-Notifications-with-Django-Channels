from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'message', 'created_at')
    list_filter = ('sender', 'receiver', 'created_at')
    search_fields = ('message', 'sender__username', 'receiver__username')