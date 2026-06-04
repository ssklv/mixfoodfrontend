import { useOrderStore } from '@/entities/order/model/orderStore';
import { useToastStore } from '@/shared/lib/toastStore';
import { getOrderStatusText } from '@/shared/lib/orderStatus';

let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;

export const connectOrderSocket = () => {
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    console.warn('No access token, WebSocket connection aborted');
    return;
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('WebSocket already connected');
    return;
  }

  if (socket) {
    socket.close();
    socket = null;
  }

  try {
    socket = new WebSocket(`ws://localhost:8083/ws?token=${token}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ORDER_STATUS_CHANGED') {
          useOrderStore.getState().updateOrderStatus(data.orderId, data.status);
          const statusText = getOrderStatusText(data.status);
          useToastStore.getState().showToast(
            'Статус заказа обновлён',
            `Заказ №${data.orderId} — ${statusText}`
          );
        } else {
          console.log('Unknown WebSocket message type:', data.type);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed: code=${event.code}, reason=${event.reason}`);
      socket = null;

      if (sessionStorage.getItem('accessToken')) {
        reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connectOrderSocket();
        }, 5000);
      }
    };
  } catch (err) {
    console.error('Failed to create WebSocket:', err);
    socket = null;
  }
};

export const closeOrderSocket = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
  console.log('WebSocket closed manually');
};