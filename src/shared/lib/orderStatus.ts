export const getOrderStatusText = (status: string): string => {
  const map: Record<string, string> = {
    new: 'Ожидает подтверждения',
    cooking: 'Готовится на кухне',
    delivering: 'В пути',
    done: 'Доставлен',
    cancelled: 'Отменён',
  };
  return map[status] || status;
};