class Player:
    def __init__(self, name, chips=1000):
        self.name = name
        self.hand = []
        self.chips = chips
        self.is_dealer = False
        self.game_over = False
        self.is_folded = False

    def receive_cards(self, cards):
        for card in cards:
            self.hand.append(card)

    def __str__(self):
        return f"{self.name}: {self.chips} chips"

    def bet(self, bet_amount):
        if bet_amount > self.chips:
            bet_amount = self.chips
            self.chips = 0
            return bet_amount

        self.chips -= bet_amount
        return bet_amount
