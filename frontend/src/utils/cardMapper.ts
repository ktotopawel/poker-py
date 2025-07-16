const suitMap: Record<string, string> = {
  '♣': 'clubs',
  '♠': 'spades',
  '♥': 'hearts',
  '♦': 'diamonds',
};

const rankMap: Record<string, string> = {
  A: 'ace',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  T: '10',
  '10': '10',
  J: 'jack',
  Q: 'queen',
  K: 'king',
};

export function getCardImagePath(cardString: string): string {
  if (!cardString || cardString.length < 2) {
    throw new Error(`Invalid card string: ${cardString}`);
  }

  const cleanCardString = cardString.replace(/[[\]]/g, '');

  if (!cleanCardString || cleanCardString.length < 2) {
    throw new Error(`Invalid card string after cleaning: ${cardString}`);
  }

  let rank: string;
  let suit: string;

  if (cleanCardString.length === 2) {
    rank = cleanCardString[0];
    suit = cleanCardString[1];
  } else if (cleanCardString.length === 3 && cleanCardString.startsWith('10')) {
    rank = '10';
    suit = cleanCardString[2];
  } else {
    throw new Error(`Unsupported card string format: ${cardString} (cleaned: ${cleanCardString})`);
  }

  const rankName = rankMap[rank.toUpperCase()];
  const suitName = suitMap[suit];

  if (!rankName) {
    throw new Error(`Invalid card rank: ${rank}`);
  }

  if (!suitName) {
    throw new Error(`Invalid card suit: ${suit}`);
  }

  const filename = `${rankName}_of_${suitName}.svg`;

  return `/cards/${filename}`;
}

export async function importCardImage(cardString: string): Promise<string> {
  const imagePath = getCardImagePath(cardString);

  try {
    const module = (await import(/* @vite-ignore */ imagePath)) as { default: string };
    return module.default;
  } catch (error) {
    throw new Error(`Failed to import card image for ${cardString}: ${String(error)}`);
  }
}

export function getAllValidCards(): string[] {
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
  const suits = ['♣', '♠', '♥', '♦'];

  const cards: string[] = [];

  for (const rank of ranks) {
    for (const suit of suits) {
      cards.push(`${rank}${suit}`);
    }
  }

  return cards;
}

export function isValidCard(cardString: string): boolean {
  try {
    getCardImagePath(cardString);
    return true;
  } catch {
    return false;
  }
}
