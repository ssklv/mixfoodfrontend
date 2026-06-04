import { useOrderStore } from '@/entities/order/model/orderStore';

let socket: WebSocket | null = null;

export const connectOrderSocket = () => {
  const token = sessionStorage.getItem('accessToken');

  if (!token) return;

  if (socket) return;

  socket = new WebSocket(
    `ws://localhost:8083/ws?token=${token}`
  );

  socket.onopen = () => {
    console.log('WS connected');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'ORDER_STATUS_CHANGED') {
      useOrderStore
        .getState()
        .updateOrderStatus(
          data.orderId,
          data.status
        );

      alert(data.message);
    }
  };

  socket.onclose = () => {
    socket = null;
  };
};