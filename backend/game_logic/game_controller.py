from enum import Enum

from treys import Card, Evaluator

try:
    from .deck import Deck
    from .player import CPUPlayer, Player
except ImportError:
    from deck import Deck
    from player import CPUPlayer, Player


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
        self.cpu_players = self.add_cpu(
            cpu_num=cpu_num,
            custom_chips=custom_chips if custom_chips is not None else 1000,
        )
        self.all_players = [self.player] + self.cpu_players
        self.bank_chips = 0
        self.current_stake = 0
        self.big_blind = big_blind
        self.is_preflop = False
        self.evaluator = Evaluator()
        self.phase = Phase.WAITING
        self.round_number = 0
        self.waiting_for_player = False
        self.game_over = False
        self.acted_players = set()
        self.showdown_results = None

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
            "phase": self.phase.value,
            "round_number": self.round_number,
            "table_cards": [Card.int_to_pretty_str(card) for card in self.table_cards],
            "bank_chips": self.bank_chips,
            "current_stake": self.current_stake,
            "bots_state": self.get_bots_state(),
            "waiting_for_player": self.waiting_for_player,
            "call_amount": max(0, self.current_stake - self.player.stake),
            "can_check": self.current_stake == self.player.stake,
            "game_over": self.game_over,
            "showdown_results": self.showdown_results,
            "player": {
                **self.player.get_state(),
                "hand": [Card.int_to_pretty_str(card) for card in self.player.hand],
            },
        }

    def add_cpu(self, cpu_num, custom_chips):
        cpu_arr = []
        for i in range(cpu_num):
            cpu_arr.append(CPUPlayer(name=f"CPU{i}", chips=custom_chips))
        return cpu_arr

    def receive_bet(self, bet, player_new_stake):
        if self.current_stake < player_new_stake:
            self.current_stake = player_new_stake
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
        self.showdown_results = None

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
        self.acted_players.clear()

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

        small_blind_bet = small_blind_player.bet(small_blind)
        self.receive_bet(small_blind_bet, small_blind_player.stake)
        big_blind_bet = big_blind_player.bet(self.big_blind)
        self.receive_bet(big_blind_bet, big_blind_player.stake)

    def get_betting_order(self, next_player=None):
        dealer_index = 0
        active_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]

        if next_player and next_player in active_players:
            next_player_index = active_players.index(next_player)
            return (
                active_players[next_player_index:] + active_players[:next_player_index]
            )

        for i, p in enumerate(active_players):
            if p.is_dealer:
                dealer_index = i
                break

        return (
            active_players[(dealer_index + 1) :] + active_players[: (dealer_index + 1)]
        )

    def process_bots(self, next_player=None):
        betting_order = self.get_betting_order(next_player)

        if len(betting_order) <= 1:
            return self.proceed_to_next_phase()

        someone_acted = False
        for player in betting_order:
            if player in self.acted_players:
                continue

            if isinstance(player, CPUPlayer):
                if player.is_folded or player.game_over:
                    continue

                bot_decision = self.receive_bot_decision(player)

                if bot_decision == "fold":
                    player.is_folded = True

                if bot_decision == "raise":
                    self.acted_players.clear()

                self.acted_players.add(player)
                someone_acted = True

                if self.is_betting_complete():
                    return self.proceed_to_next_phase()

            else:
                return self.handle_player_turn()

        if self.is_betting_complete():
            return self.proceed_to_next_phase()
        elif someone_acted:
            return self.process_bots()
        else:
            active_players = [
                p for p in self.all_players if not p.is_folded and not p.game_over
            ]
            if self.player in active_players and self.player not in self.acted_players:
                return self.handle_player_turn()
            else:
                return {"success": True, "game_state": self.get_game_state()}

    def is_betting_complete(self):
        active_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]

        if len(active_players) <= 1:
            return True

        all_acted = all(p in self.acted_players for p in active_players)
        stakes_equal = all(
            p.stake == self.current_stake for p in active_players if not p.is_folded
        )

        return all_acted and stakes_equal

    def handle_player_turn(self):
        self.waiting_for_player = True

        return {"success": True, "game_state": self.get_game_state()}

    def receive_bot_decision(self, bot: CPUPlayer):
        decision = bot.bot_turn(self.table_cards, self.bank_chips, self.current_stake)

        action = decision["action"]

        if action == "raise":
            bet_amount = bot.bet(decision["amount"])
            self.receive_bet(bet_amount, bot.stake)

        if action == "call":
            bet_amount = bot.bet(decision["amount"])
            self.receive_bet(bet_amount, bot.stake)

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

    def handle_showdown(self, active_players):
        final_scores = []
        showdown_results = []

        for player in active_players:
            score = self.evaluator.evaluate(player.hand, self.table_cards)
            hand_info = self.get_hand_description(score, player.hand, self.table_cards)

            player_result = {
                "name": player.name,
                "hand": [Card.int_to_pretty_str(card) for card in player.hand],
                "score": score,
                "hand_description": hand_info["name"],
                "hand_strength": hand_info["strength"],
                "is_winner": False,
            }

            final_scores.append({"player": player, "score": score})
            showdown_results.append(player_result)

        winner_score = min(final_scores, key=lambda x: x["score"])["score"]
        winners = [item for item in final_scores if item["score"] == winner_score]

        chips_per_winner = self.bank_chips // len(winners)
        for winner_data in winners:
            winner_data["player"].chips += chips_per_winner
            for result in showdown_results:
                if result["name"] == winner_data["player"].name:
                    result["is_winner"] = True

        self.bank_chips = 0
        self.showdown_results = showdown_results

        return self.handle_end_of_round()

    def player_action(self, action, amount):
        active_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]
        player_index = active_players.index(self.player)
        player_turn = self.player.take_turn(self.current_stake, action, amount)

        if player_turn["action"] == "call" or player_turn["action"] == "raise":
            bet_amount = self.player.bet(player_turn["amount"])
            self.receive_bet(bet_amount, self.player.stake)

        if player_turn["action"] == "raise":
            self.acted_players.clear()
            self.acted_players.add(self.player)
            self.waiting_for_player = False
            return self.process_bots()
        else:
            self.acted_players.add(self.player)
            self.waiting_for_player = False

            next_player = None
            if player_index + 1 < len(active_players):
                next_player = active_players[player_index + 1]

            return self.process_bots(next_player)

    def get_hand_description(self, score, hand, board):
        rank_class = self.evaluator.get_rank_class(score)
        class_string = self.evaluator.class_to_string(rank_class)

        hand_percentage = 1.0 - (score - 1) / 7461.0

        return {"name": class_string, "strength": round(hand_percentage * 100, 1)}


if __name__ == "__main__":
    import os
    import sys

    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    sys.path.insert(0, parent_dir)

    testGame = PokerGame("test player", 1000, 2)
    result = testGame.start_round()
    print("Game started:", result)
