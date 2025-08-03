import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import logging

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query string
        query_string = self.scope['query_string'].decode()
        token = None
        if 'token=' in query_string:
            try:
                token = query_string.split('token=')[1].split('&')[0]
            except IndexError:
                logger.error("Invalid query string format: token not found")
                await self.close()
                return

        if not token:
            logger.warning("WebSocket connection rejected: No token provided")
            await self.close()
            return

        try:
            # Validate JWT token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.group_name = f'user_{user_id}'
            logger.debug(f"WebSocket connected for user_id {user_id}, group {self.group_name}")

            # Add to group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        except (InvalidToken, TokenError) as e:
            logger.error(f"WebSocket connection rejected: Invalid token - {str(e)}")
            await self.close()
        except Exception as e:
            logger.error(f"WebSocket connection error: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            logger.debug(f"WebSocket disconnected for group {self.group_name}, close_code: {close_code}")
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def send_notification(self, event):
        logger.debug(f"Sending notification to group {self.group_name}: {event['message']} from {event['sender']}")
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))