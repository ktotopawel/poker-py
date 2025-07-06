from enum import Enum

from treys import Card, Evaluator

from game_logic.deck import Deck
from game_logic.player import CPUPlayer, Player


class Phase(Enum):
    WAITING = "waiting"
    COMPLETE = "complete"
    PREFLOP = "preflop"
    FLOP = "flop"
    TURN = "turn"
    RIVER = "river"
    SHOWDOWN = "showdown"


class PokerGame:
    def __init__(self, player_name, custom_chips, cpu_num, big_blind=50):
        self.deck = Deck()
        self.player = Player(
            name=player_name, chips=custom_chips if custom_chips is not None else 1000
        )
        self.table_cards = []
        self.cpu_players = self.add_cpu(cpu_num=cpu_num)
        self.all_players = [self.player] + self.cpu_players
        self.bank_chips = 0
        self.current_stake = 0
        self.big_blind = big_blind
        self.is_preflop = False
        self.evaluator = Evaluator()
        self.phase = Phase.WAITING
        self.round_number = 0
        self.waiting_for_player = False
        self.last_round_result = None
        self.game_over = False

        self.all_players[0].is_dealer = True

    def get_player_hand(self):
        player_cards = []
        for card in self.player.hand:
            player_cards.append(Card.print_pretty_card(card))
        return player_cards

    def get_bots_state(self):
        bots_state = {}

        for bot in self.cpu_players:
            bots_state[bot.name] = bot.get_state()
        return bots_state

    def get_game_state(self):
        return {
            "phase": self.phase,
            "round_number": self.round_number,
            "table_cards": [Card.int_to_pretty_str(card) for card in self.table_cards],
            "bank_chips": self.bank_chips,
            "current_stake": self.current_stake,
            "player_hand": [Card.int_to_pretty_str(card) for card in self.player.hand],
            "player_chips": self.player.chips,
            "player_stake": self.player.stake,
            "bots_state": self.get_bots_state(),
            "waiting_for_player": self.waiting_for_player,
            "call_amount": max(0, self.current_stake - self.player.stake),
            "can_check": self.current_stake == self.player.stake,
            "last_round_result": self.last_round_result,
            "game_over": self.game_over,
        }

    def add_cpu(self, cpu_num):
        cpu_arr = []
        for i in range(cpu_num):
            cpu_arr.append(CPUPlayer(name=f"CPU{i}"))
        return cpu_arr

    def receive_bet(self, bet):
        if self.current_stake < bet:
            self.current_stake = bet
        self.bank_chips += bet

    def deal_cards(self):
        for current_player in self.all_players:
            current_player.receive_cards(self.deck.deal(1))
        for current_player in self.all_players:
            current_player.receive_cards(self.deck.deal(1))

    def reset_round(self):
        self.deck = Deck()
        self.table_cards = []
        self.last_round_result = None
        self.waiting_for_player = False

        for player in self.all_players:
            player.hand = []
            player.is_folded = False
            player.stake = 0

        self.bank_chips = 0
        self.current_stake = 0

        current_dealer_index = next(
            i for i, p in enumerate(self.all_players) if p.is_dealer
        )
        self.all_players[current_dealer_index].is_dealer = False
        next_dealer_index = (current_dealer_index + 1) % len(self.all_players)
        self.all_players[next_dealer_index].is_dealer = True

    def start_round(self):
        if self.phase != Phase.WAITING and self.phase != Phase.COMPLETE:
            return {"error": "Round in progress"}

        self.round_number += 1
        self.reset_round()

        self.deal_cards()
        self.phase = Phase.PREFLOP

        return self.start_betting_phase()

    def start_betting_phase(self):
        if self.phase == Phase.PREFLOP:
            self.handle_blinds()

        return self.process_bots()

    def handle_blinds(self):
        dealer_index = 0
        small_blind = self.big_blind / 2

        for i, p in enumerate(self.all_players):
            if p.is_dealer:
                dealer_index = i

        small_blind_player = self.all_players[
            (dealer_index + 1) % len(self.all_players)
        ]
        big_blind_player = self.all_players[(dealer_index + 2) % len(self.all_players)]

        self.receive_bet(small_blind_player.bet(small_blind))
        self.receive_bet(big_blind_player.bet(self.big_blind))
        self.current_stake = self.big_blind

    def get_betting_order(self):
        dealer_index = 0

        for i, p in enumerate(self.all_players):
            if p.is_dealer:
                dealer_index = i

        return (
            self.all_players[(dealer_index + 1) :]
            + self.all_players[: (dealer_index + 1)]
        )

    def process_bots(self):
        active_players = [
            p for p in self.all_players if not p.game_over and not p.is_folded
        ]

        if len(active_players) <= 1:
            return self.proceed_to_next_phase()

        betting_order = self.get_betting_order()
        max_betting_rounds = 10
        betting_round = 0

        while betting_round < max_betting_rounds:
            betting_round += 1
            action_taken = False

            for player in betting_order:
                if player.is_folded or player.game_over:
                    continue

                if player.stake >= self.current_stake and not action_taken:
                    continue

                if isinstance(player, Player) and not isinstance(player, CPUPlayer):
                    self.waiting_for_player = True
                    return {"success": True, "game_state": self.get_game_state()}
                else:
                    bot_action = self.receive_bot_decision(player)

                    if bot_action == "raise":
                        action_taken = True
                    elif bot_action == "fold":
                        player.is_folded = True

            active_players = [
                p for p in self.all_players if not p.game_over and not p.is_folded
            ]

            if len(active_players) <= 1:
                return self.proceed_to_next_phase()

            stakes = [p.stake for p in active_players]
            if len(set(stakes)) <= 1 and not action_taken:
                break

        return self.proceed_to_next_phase()

    def receive_bot_decision(self, bot: CPUPlayer):
        decision = bot.bot_turn(self.table_cards, self.bank_chips, self.current_stake)

        action = decision["action"]

        if action == "raise":
            self.receive_bet(bot.bet(decision["amount"]))

        if action == "call":
            self.receive_bet(bot.bet(decision["amount"]))

        return action

    def proceed_to_next_phase(self):
        active_players = [
            p for p in self.all_players if not p.game_over and not p.is_folded
        ]
        self.reset_stakes()

        if len(active_players) <= 1:
            return self.handle_end_of_round()

        if self.phase == Phase.PREFLOP:
            self.table_cards.extend(self.deck.deal(3))
            self.phase = Phase.FLOP
            return self.start_betting_phase()

        elif self.phase == Phase.FLOP:
            self.table_cards.extend(self.deck.deal(1))
            self.phase = Phase.TURN
            return self.start_betting_phase()

        elif self.phase == Phase.TURN:
            self.table_cards.extend(self.deck.deal(1))
            self.phase = Phase.RIVER
            return self.start_betting_phase()

        elif self.phase == Phase.RIVER:
            self.phase = Phase.SHOWDOWN
            return self.handle_showdown(active_players)

        return {"success": True, "game_state": self.get_game_state()}

    def reset_stakes(self):
        self.current_stake = 0
        for player in self.all_players:
            player.stake = 0

    def handle_end_of_round(self):
        self.phase = Phase.COMPLETE
        self.waiting_for_player = False

        in_game_players = [p for p in self.all_players if not p.game_over]
        if len(in_game_players) <= 1:
            self.game_over = True
            return {"success": True, "game_state": self.get_game_state()}
        else:
            active_players = [
                p for p in self.all_players if not p.game_over and not p.is_folded
            ]
            if len(active_players) == 1:
                active_players[0].chips += self.bank_chips
                return {"success": True, "game_state": self.get_game_state()}
            else:
                return self.handle_showdown(active_players)

    def handle_showdown(self, active_players):
        final_scores = []

        for player in active_players:
            score = self.evaluator.evaluate(player.hand, self.table_cards)
            final_scores.append({"player": player, "score": score})

        winner_data = min(final_scores, key=lambda x: x["score"])
        winner = winner_data["player"]

        winner.chips += self.bank_chips
        return {"success": True, "game_state": self.get_game_state()}


if __name__ == "__main__":
    testGame = PokerGame("test player", 1000, 2)
    testGame.start_round()
