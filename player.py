import random


class Player:
    def __init__(self, name, chips=1000):
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

    def take_turn(self, current_stake):
        print("1. Fold \n 2. Check \n 3. Raise")
        player_choice = input()
        match player_choice:
            case "1":
                self.is_folded = True
                return f"{self.name} folded"
            case "2":
                if current_stake > self.stake:
                    self.bet(current_stake - self.stake)
            case "3":
                print("Enter amount to raise")
                raise_amount = input()
                self.bet(raise_amount)


class CPUPlayer(Player):
    def take_turn(self, current_stake):
        player_choice = str(random.randrange(1, 3))
        match player_choice:
            case "1":
                self.is_folded = True
                return f"{self.name} folded"
            case "2":
                if current_stake > self.stake:
                    self.bet(current_stake - self.stake)
            case "3":
                print("Enter amount to raise")
                raise_amount = random.randrange(10, 100, 5)
                self.bet(raise_amount)
