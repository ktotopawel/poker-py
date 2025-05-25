import random

RANKS = '2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A'.split(', ')
SUITS = ['♠', '♥', '♦', '♦']


class Card:
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank

    def __str__(self):
        return f"{self.rank}{self.suit}"


class Deck:
    def __init__(self):
        self.cards = []
        for suit in SUITS:
            for rank in RANKS:
                self.cards.append(Card(suit, rank))
        self.shuffle()

    def deal(self, amount=1):
        dealt_cards = []
        for _ in range(amount):
            dealt_cards.append(self.cards.pop())
        return dealt_cards

    def shuffle(self):
        random.shuffle(self.cards)
        
    def print_deck(self):
        for card in self.cards:
            print(card)


testDeck = Deck()
print(len(testDeck.cards))
testDeck.print_deck()