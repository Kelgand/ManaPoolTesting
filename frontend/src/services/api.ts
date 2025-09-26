import { Order, Suggestions } from '../types';

export const fetchOrders = async (email: string, apiKey: string): Promise<Order[]> => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, apiKey }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  const data = await response.json();
  return data.orders || [];
};

export const fetchSuggestions = async (cards: string[], email: string, apiKey: string): Promise<Suggestions> => {
  const response = await fetch('/api/magus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cards, email, apiKey }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch suggestions: ${response.status}`);
  }

  const data = await response.json();
  return data.suggestions;
};

export const extractCardsFromOrder = (order: Order): string[] => {
  const cards: string[] = [];
  order?.order_seller_details?.forEach((seller) => {
    seller.items?.forEach((item) => {
      if (item.product?.product_type === 'mtg_single') {
        cards.push(item.product.single.name);
      }
    });
  });
  return cards;
};