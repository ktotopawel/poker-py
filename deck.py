import random

RANKS = '2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A'.split()
SUITS = ['sp', 'he', 'di', 'cl']


class Card:
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank
        
class Deck: 
    def __init__(self):
        self.cards = []
        for suit in SUITS:
            for rank in RANKS:
                self.cards.append(Card(suit, rank))
        random.shuffle(self.cards)
        
    def 