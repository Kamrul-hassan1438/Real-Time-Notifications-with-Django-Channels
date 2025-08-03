from django.contrib.auth.models import User
from .models import Notification
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.exclude(id=request.user.id)
    logger.debug(f"Users available for {request.user.username}: {[u.username for u in users]}")
    return Response([
        {'id': user.id, 'username': user.username} for user in users
    ], status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request):
    receiver_id = request.data.get('receiver')
    message = request.data.get('message')
    logger.debug(f"Sending notification from {request.user.username} to receiver_id {receiver_id}: {message}")
    try:
        receiver = User.objects.get(id=receiver_id)
        if not message.strip():
            logger.warning("Empty message attempted.")
            return Response({"error": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
        Notification.objects.create(
            sender=request.user,
            receiver=receiver,
            message=message
        )
        logger.info(f"Notification created: {request.user.username} to {receiver.username}")
        return Response({"message": "Notification sent successfully."}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        logger.error(f"Receiver ID {receiver_id} does not exist.")
        return Response({"error": "Selected user does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.exception("Error in send_notification")
        return Response({"error": f"Error sending notification: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)