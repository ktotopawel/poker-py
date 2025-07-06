from treys import Card, Evaluator

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
            actual_bet = self.chips
            self.chips = 0
            self.stake += actual_bet
            if self.chips == 0:
                self.game_over = True
            return actual_bet
        else:
            self.chips -= bet_amount
            self.stake += bet_amount
            return bet_amount

    def take_turn(self, current_stake: int, action: str, amount: int = 0):
        call_amount = current_stake - self.stake

        if action == "fold":
            self.is_folded = True
            return {"action": action}

        elif action == "call":
            if call_amount > 0:
                return {"action": action, "amount": call_amount}
            else:
                return {"action": "check"}

        elif action == "raise":
            return {"action": action, "amount": amount}

        else:
            return {"error": "invalid action"}

    def show_hand(self):
        print(f"{self.name} cards: ")
        for card in self.hand:
            Card.print_pretty_card(card)


class CPUPlayer(Player):
    def __init__(self, name, chips=1000):
        super().__init__(name, chips)
        self.evaluator = Evaluator()
        self.status = ""

    def get_state(self):
        return {
            "chips": self.chips,
            "status": self.status,
            "stake": self.stake,
            "is_dealer": self.is_dealer,
            "game_over": self.game_over,
            "is_folded": self.is_folded,
        }

    def bot_turn(self, current_table, pot, current_stake):
        to_call = current_stake - self.stake

        if to_call == 0:
            self.status = "check"
            return {"action": "check"}

        if len(current_table) == 0:
            if to_call <= self.chips * 0.1:
                self.status = "call"

                return {"action": "call", "amount": to_call}
            else:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}

        if len(current_table) > 0:
            if len(self.hand) != 2:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}

            if len(current_table) > 5:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}

            try:
                rank = self.evaluator.evaluate(self.hand, current_table)
                hand_strength = (MAX_HAND_RANK - rank) / (MAX_HAND_RANK - 1)
            except Exception:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}

            if to_call > self.chips * 0.15 and hand_strength < 0.4:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}
            elif hand_strength > 0.8 and self.chips > 100:
                raise_amount = min(50, self.chips // 4)
                self.status = "raise"
                return {"action": "raise", "amount": raise_amount}
            elif hand_strength > 0.5 or to_call <= self.chips * 0.05:
                self.status = "call"
                return {"action": "call", "amount": to_call}
            else:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}
        else:
            if to_call <= self.chips * 0.1:
                self.status = "call"
                return {"action": "call", "amount": to_call}
            else:
                self.is_folded = True
                self.status = "fold"
                return {"action": "fold"}
