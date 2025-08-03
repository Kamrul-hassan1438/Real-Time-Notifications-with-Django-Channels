from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Notification
from django.contrib import messages
import logging

logger = logging.getLogger(__name__)

@login_required
def index(request):
    users = User.objects.exclude(id=request.user.id)
    logger.debug(f"Users available for {request.user.username}: {[u.username for u in users]}")
    return render(request, 'index.html', {'users': users})

@login_required
def send_notification(request):
    if request.method == 'POST':
        receiver_id = request.POST.get('receiver')
        message = request.POST.get('message')
        logger.debug(f"Sending notification from {request.user.username} to receiver_id {receiver_id}: {message}")
        try:
            receiver = User.objects.get(id=receiver_id)
            if not message.strip():
                messages.error(request, "Message cannot be empty.")
                logger.warning("Empty message attempted.")
                return redirect('home')
            Notification.objects.create(
                sender=request.user,
                receiver=receiver,
                message=message
            )
            messages.success(request, "Notification sent successfully.")
            logger.info(f"Notification created: {request.user.username} to {receiver.username}")
        except User.DoesNotExist:
            messages.error(request, "Selected user does not exist.")
            logger.error(f"Receiver ID {receiver_id} does not exist.")
        except Exception as e:
            messages.error(request, f"Error sending notification: {str(e)}")
            logger.exception("Error in send_notification")
        return redirect('home')
    return redirect('home')