import React from 'react';
import { Order } from '../types';

interface OrderSelectorProps {
  orders: Order[];
  selectedOrder: string;
  onOrderSelect: (orderId: string) => void;
}

export const OrderSelector: React.FC<OrderSelectorProps> = ({
  orders,
  selectedOrder,
  onOrderSelect,
}) => {
  if (orders.length === 0) return null;

  return (
    <div className="orders-section">
      <h2>Last {orders.length} Orders</h2>
      <select 
        value={selectedOrder} 
        onChange={(e) => onOrderSelect(e.target.value)}
        className="order-select"
      >
        <option value="">Select an order with singles...</option>
        {orders.map((order) => (
          <option key={order.id} value={order.id}>
            Order #{order.order_number} - ${(order.total_cents / 100).toFixed(2)} ({new Date(order.created_at).toLocaleDateString()})
          </option>
        ))}
      </select>
    </div>
  );
};