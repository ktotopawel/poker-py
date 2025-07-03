import random
from treys import Card

RANKS = "2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A".split(", ")
SUITS = ["s", "h", "d", "c"]


class Deck:
    def __init__(self):
        self.cards = self.__make_deck()
        self.shuffle()

    def __make_deck(self):
        new_deck = []

        for suit in SUITS:
            for rank in RANKS:
                new_deck.append(Card.new(rank + suit))

        return new_deck

    def deal(self, amount=1):
        dealt_cards = []
        for _ in range(amount):
            dealt_cards.append(self.cards.pop())
        return dealt_cards

    def shuffle(self):
        print("cards shuffled")
        random.shuffle(self.cards)

    def print_deck(self):
        Card.print_pretty_cards(self.cards)
