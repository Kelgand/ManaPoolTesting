import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Order, Suggestions } from './types';
import { CredentialsForm } from './components/CredentialsForm';
import { OrderSelector } from './components/OrderSelector';
import { SuggestionsDisplay } from './components/SuggestionsDisplay';
import { fetchOrders, fetchSuggestions, extractCardsFromOrder } from './services/api';
import './styles.css';

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleFetchOrders = async () => {
    if (!apiKey || !email) {
      setError('Please enter both API key and email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ordersData = await fetchOrders(email, apiKey);
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = async (orderId: string) => {
    setSelectedOrder(orderId);
    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const cards = extractCardsFromOrder(order);
    
    if (cards.length > 0) {
      setLoadingSuggestions(true);
      setSuggestions(null);
      try {
        const suggestionsData = await fetchSuggestions(cards, email, apiKey);
        setSuggestions(suggestionsData);
      } catch (err) {
        console.error('Failed to call Magus:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions(null);
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="app">
      <h1>Mana Pool Demo</h1>
      
      <CredentialsForm
        email={email}
        apiKey={apiKey}
        loading={loading}
        onEmailChange={setEmail}
        onApiKeyChange={setApiKey}
        onSubmit={handleFetchOrders}
      />

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      <OrderSelector
        orders={orders}
        selectedOrder={selectedOrder}
        onOrderSelect={handleOrderSelect}
      />
      
      <SuggestionsDisplay
        suggestions={suggestions}
        loadingSuggestions={loadingSuggestions}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);