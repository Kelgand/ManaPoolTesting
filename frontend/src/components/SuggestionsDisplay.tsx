import React from 'react';
import { Suggestions } from '../types';

interface SuggestionsDisplayProps {
  suggestions: Suggestions | null;
  loadingSuggestions: boolean;
  selectedOrder: string;
}

export const SuggestionsDisplay: React.FC<SuggestionsDisplayProps> = ({
  suggestions,
  loadingSuggestions,
  selectedOrder,
}) => {
  const copyAllCards = () => {
    if (!suggestions) return;
    const allCards = Object.entries(suggestions)
      .filter(([key]) => !['totalCost', 'orderCount'].includes(key))
      .flatMap(([_, cards]) => cards as string[])
      .join('\n');
    navigator.clipboard.writeText(allCards);
  };

  const copyGroupCards = (cards: string[]) => {
    navigator.clipboard.writeText(cards.join('\n'));
  };

  if (loadingSuggestions) {
    return (
      <div className="suggestions-section">
        <h2>Consulting Magus for related cards (might take a second)...</h2>
      </div>
    );
  }

  if (selectedOrder && !suggestions) {
    return (
      <div className="suggestions-section">
        <h2>No individual cards found in this order (likely contains sealed products only)</h2>
      </div>
    );
  }

  if (!suggestions) return null;

  return (
    <div className="suggestions-section">
      <div className="suggestions-header">
        <h2>Card Suggestions</h2>
        <button onClick={copyAllCards} className="secondary-button">
          Copy All For Mass Entry
        </button>
      </div>
	<p>
		Here are some related upgrades that go with your order.
	</p>
      {suggestions.totalCost && (
        <p>
          <strong>
            Total cost for all recommended cards: ${((suggestions.totalCost as number) / 100).toFixed(2)} across {suggestions.orderCount || 1} order{(suggestions.orderCount || 1) !== 1 ? 's' : ''}
          </strong>
        </p>
      )}
      {Object.entries(suggestions)
        .filter(([key]) => !['totalCost', 'orderCount'].includes(key))
        .map(([reason, cards]) => (
          <div key={reason} className="suggestion-group">
            <div className="group-header">
              <h3>{reason}</h3>
              <button 
                onClick={() => copyGroupCards(cards as string[])}
                className="small-button"
              >
                Copy Group for Mass Entry
              </button>
            </div>
            <ul className="card-list">
              {(cards as string[]).map((card, index) => (
                <li key={index}>{card}</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};