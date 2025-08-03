import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_authenticated:
            self.group_name = f'user_{self.scope["user"].id}'
            logger.debug(f"WebSocket connected for user {self.scope['user'].username}, group {self.group_name}")
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            logger.warning("WebSocket connection rejected: User not authenticated")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            logger.debug(f"WebSocket disconnected for group {self.group_name}")
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def send_notification(self, event):
        logger.debug(f"Sending notification to {self.scope['user'].username}: {event['message']} from {event['sender']}")
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))