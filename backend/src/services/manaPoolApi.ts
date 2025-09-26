export const createHeaders = (email: string, apiKey: string) => ({
  'X-ManaPool-Email': email,
  'X-ManaPool-Access-Token': apiKey,
});

export const fetchOrdersList = async (email: string, apiKey: string) => {
  const response = await fetch('https://manapool.com/api/v1/buyer/orders?limit=10', {
    headers: createHeaders(email, apiKey),
  });
  return response.json();
};

export const fetchOrderDetails = async (orderId: string, email: string, apiKey: string) => {
  const response = await fetch(`https://manapool.com/api/v1/buyer/orders/${orderId}`, {
    headers: createHeaders(email, apiKey),
  });
  const data = await response.json();
  return data.order;
};

export const fetchCardInfo = async (cardNames: string[], email: string, apiKey: string) => {
  const response = await fetch('https://manapool.com/api/v1/card_info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...createHeaders(email, apiKey),
    },
    body: JSON.stringify({ card_names: cardNames }),
  });
  return response.json();
};

export const optimizeCart = async (cart: any[], email: string, apiKey: string) => {
  const response = await fetch('https://manapool.com/api/v1/buyer/optimizer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...createHeaders(email, apiKey),
    },
    body: JSON.stringify({ 
      cart,
      model: 'lowest_price',
      destination_country: 'US'
    }),
  });
  return response.text();
};