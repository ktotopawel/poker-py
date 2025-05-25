import random
from treys import Evaluator

from deck import Deck

MAX_HAND_RANK = 7462


class Player:
    def __init__(self, name, chips=10000):
        self.name = name
        self.hand = []
        self.chips = chips
        self.is_dealer = False
        self.game_over = False
        self.is_folded = False
        self.stake = 0

    def receive_cards(self, cards):
        for card in cards:
            self.hand.append(card)

    def __str__(self):
        return f"{self.name}: {self.chips} chips"

    def bet(self, bet_amount):
        if bet_amount > self.chips:
            self.game_over = True

        self.chips -= bet_amount
        self.stake += bet_amount
        return bet_amount

    def take_turn(self, current_stake):
        print("1. Fold \n 2. Check/Call \n 3. Raise")
        player_choice = input()
        match player_choice:
            case "1":
                self.is_folded = True
                return f"{self.name} folded"
            case "2":
                if current_stake > self.stake:
                    self.bet(current_stake - self.stake)
            case "3":
                while True:
                    print("Enter bet amount:")
                    raise_amount = int(input())
                    if raise_amount > self.chips:
                        print("You don't have enough chips")
                        continue
                    self.bet((current_stake + raise_amount) - self.stake)


class CPUPlayer(Player):
    def __init__(self, name, chips=1000):
        super().__init__(name, chips)
        self.evaluator = Evaluator()

    def bot_turn(self, current_table, pot, current_stake):
        to_call = current_stake - self.stake

        if len(current_table) == 0:
            if to_call < self.chips * 0.1:
                return "call"
            else:
                return "fold"

        rank = self.evaluator.evaluate(self.hand, current_table)
        hand_strength = (MAX_HAND_RANK - rank) / (MAX_HAND_RANK - 1)

        if to_call > self.chips * 0.1 and hand_strength < 0.5:
            return "fold"
        elif hand_strength > 0.85 and self.chips > 5 * 2:
            return "raise"
        elif hand_strength > 0.4 or to_call <= self.chips * 0.05:
            return "call"

        return "fold"


testDeck = Deck()
table = testDeck.deal(3)
bot = CPUPlayer("cpu")
bot.receive_cards(testDeck.deal(2))
print(bot.bot_turn(table, 1000, 100))
