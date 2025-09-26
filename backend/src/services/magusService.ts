import { fetchCardInfo, optimizeCart } from './manaPoolApi';

export const getMagusSuggestions = async (cards: string[]) => {
  const prompt = `I bought the following cards: ${cards.slice(0, 5).join(', ')}. What are some cards that would go well with it? Format your response in JSON, with a key for the reason (one or two words at most, such as "Ramp", "Finisher", or "Card Draw") for choosing a card or cards and an array for the value of what the cards are.`;
  
  const response = await fetch('https://manapool.com/api/ai/chat-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  const data = await response.json();
  return JSON.parse(data.response);
};

export const filterExistingCards = (suggestions: Record<string, string[]>, ownedCards: string[]) => {
  const filtered: Record<string, string[]> = {};
  Object.entries(suggestions).forEach(([reason, cardList]) => {
    const filteredCards = cardList.filter(card => !ownedCards.includes(card));
    if (filteredCards.length > 0) {
      filtered[reason] = filteredCards;
    }
  });
  return filtered;
};

export const validateCards = async (cards: string[], email: string, apiKey: string) => {
  const cardInfo = await fetchCardInfo(cards, email, apiKey);
  return cardInfo.cards
    .filter((card: any) => card && card.name)
    .map((card: any) => card.name);
};

export const createOptimizerCart = (cardNames: string[]) => {
  return cardNames.map((cardName: string) => ({
    type: 'mtg_single',
    name: cardName,
    quantity_requested: 1,
    language_ids: ['EN'],
    finish_ids: ['NF'],
    condition_ids: ['NM', 'LP']
  }));
};

export const parseOptimizerResponse = (optimizerText: string) => {
  try {
    return JSON.parse(optimizerText);
  } catch {
    const lines = optimizerText.trim().split('\n').filter(line => line.trim());
    const parsedLines = lines.map(line => JSON.parse(line));
    return parsedLines[parsedLines.length - 1];
  }
};

export const addPricingInfo = async (suggestions: Record<string, string[]>, email: string, apiKey: string) => {
  const uniqueCards = Array.from(new Set(Object.values(suggestions).flat()));
  
  if (uniqueCards.length === 0) return suggestions;

  const validCards = await validateCards(uniqueCards, email, apiKey);
  const optimizerCart = createOptimizerCart(validCards);
  const optimizerText = await optimizeCart(optimizerCart, email, apiKey);
  const optimizerData = parseOptimizerResponse(optimizerText);
  
  return Object.assign({}, suggestions, {
    totalCost: optimizerData.totals?.total_cents || 0,
    orderCount: optimizerData.totals?.seller_count || 0,
  });
};