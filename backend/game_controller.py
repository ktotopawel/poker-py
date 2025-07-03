from deck import Deck
from player import Player, CPUPlayer
from typing import List
from treys import Card, Evaluator
import re


class PokerGame:
    def __init__(self, player_name, custom_chips, cpu_num, big_blind=50):
        self.deck = Deck()
        self.player = Player(
            name=player_name, chips=custom_chips if custom_chips else None
        )
        self.table_cards = []
        self.player.is_dealer = True
        self.cpu_players = self.add_cpu(cpu_num=cpu_num)
        self.all_players = [self.player] + self.cpu_players
        self.bank_chips = 0
        self.current_stake = 0
        self.big_blind = big_blind
        self.is_preflop = False
        self.evaluator = Evaluator()

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

    def betting_round(self):
        dealer_index = 0

        for i, p in enumerate(self.all_players):
            if p.is_dealer:
                dealer_index = i
                break

        start_index = (dealer_index + 1) % len(self.all_players)

        if self.is_preflop:
            small_blind = self.big_blind / 2

            small_blind_player = self.all_players[start_index]
            self.receive_bet(small_blind_player.bet(small_blind))
            print(f"{small_blind_player.name} posts small blind: {small_blind}")

            big_blind_player = self.all_players[
                (start_index + 1) % len(self.all_players)
            ]
            self.receive_bet(big_blind_player.bet(self.big_blind))
            print(f"{big_blind_player.name} posts big blind: {self.big_blind}")

            start_index = (start_index + 2) % len(self.all_players)
            self.current_stake = self.big_blind

        active_players = set(
            [p for p in self.all_players if not p.is_folded and not p.game_over]
        )

        if len(active_players) <= 1:
            return

        betting_order: List[Player | CPUPlayer] = []

        for i in range(len(self.all_players)):
            player_index = (start_index + i) % len(self.all_players)
            player = self.all_players[player_index]
            if player in active_players:
                betting_order.append(player)

        players_acted = set()
        betting_complete = False

        while not betting_complete:
            for p in betting_order:
                if p.is_folded or p.game_over:
                    continue
                if p.stake < self.current_stake or p not in players_acted:
                    print(
                        f"\n{p.name}'s turn (Chips: {p.chips}, Current stake: {p.stake})"
                    )
                    print(f"Current bet to call: {self.current_stake}")
                    print(f"Pot: {self.bank_chips}")
                    if isinstance(p, Player) and not isinstance(p, CPUPlayer):
                        result = p.take_turn(self.current_stake)
                        if result:
                            print(result)
                            if "raises by" in result:
                                match = re.search(r"raises by (\d+)", result)
                                if match:
                                    raise_amount = int(match.group(1))
                                    self.current_stake += raise_amount
                                    players_acted = {p}
                    else:
                        action = p.bot_turn(
                            self.table_cards, self.bank_chips, self.current_stake
                        )
                        if action["action"] == "fold":
                            print(f"{p.name} folded")
                        elif action["action"] == "call":
                            call_amount = self.current_stake - p.stake
                            if call_amount > 0:
                                self.receive_bet(p.bet(call_amount))
                                print(f"{p.name} calls {call_amount}")
                            else:
                                print(f"{p.name} checks")
                        elif action["action"] == "check":
                            print(f"{p.name} checks")
                        elif action["action"] == "raise":
                            raise_amount = action["amount"]
                            total_bet = (self.current_stake + raise_amount) - p.stake
                            self.receive_bet(p.bet(total_bet))
                            self.current_stake += raise_amount
                            print(
                                f"{p.name} raises by {raise_amount} (total bet: {total_bet})"
                            )
                            players_acted = {p}

                    players_acted.add(p)

            active_players = set(
                [p for p in self.all_players if not p.is_folded and not p.game_over]
            )

            if len(active_players) <= 1:
                betting_complete = True
            else:
                all_matched = True
                for player in active_players:
                    if player.stake < self.current_stake:
                        all_matched = False
                        break
                if all_matched and len(players_acted) >= len(active_players):
                    betting_complete = True
        print(f"\nBetting round complete. Pot: {self.bank_chips}")
        self.is_preflop = False

    def preflop(self):
        self.is_preflop = True
        self.deal_cards()
        print(
            f"All cards dealt. Your cards: {', '.join(Card.int_to_pretty_str(card) for card in self.player.hand)}"
        )
        self.betting_round()

    def flop(self):
        self.deck.deal(1)  # burn card
        print("First card burned")
        self.table_cards.extend(self.deck.deal(3))
        print(
            f"Flop: {', '.join(Card.int_to_pretty_str(card) for card in self.table_cards)}"
        )
        self.betting_round()

    def the_turn(self):
        self.deck.deal(1)  # burn card
        self.table_cards.extend(self.deck.deal(1))
        print(
            f"The turn: {', '.join(Card.int_to_pretty_str(card) for card in self.table_cards)}"
        )
        self.betting_round()

    def river(self):
        self.deck.deal(1)  # burn card
        self.table_cards.extend(self.deck.deal(1))
        print(
            f"River: {', '.join(Card.int_to_pretty_str(card) for card in self.table_cards)}"
        )
        self.betting_round()

    def card_reveal(self):
        active_players = [
            player
            for player in self.all_players
            if not player.game_over and not player.is_folded
        ]

        final_scores = []

        for player in active_players:
            final_scores.append(
                {player.name: self.evaluator.evaluate(player.hand, self.table_cards)}
            )
            player.show_hand()

        first_place = list(
            sorted(final_scores, key=lambda score: list(score.values())[0])[0]
        )[0]

        print(f"{first_place} won")

        winner = next(p for p in active_players if p.name == first_place)
        winner.chips += self.bank_chips
        print(f"{winner.name} wins {self.bank_chips} chips!")

    def reset_round(self):
        self.deck = Deck()

        self.table_cards = []

        for player in self.all_players:
            player.hand = []
            player.is_folded = False
            player.stake = 0

        self.bank_chips = 0
        self.current_stake = 0
        self.is_preflop = False

        current_dealer_index = next(
            i for i, p in enumerate(self.all_players) if p.is_dealer
        )
        self.all_players[current_dealer_index].is_dealer = False
        next_dealer_index = (current_dealer_index + 1) % len(self.all_players)
        self.all_players[next_dealer_index].is_dealer = True

    def full_round(self):
        print("\n" + "=" * 50)
        print("NEW ROUND STARTING")
        print("=" * 50)

        active_players = [p for p in self.all_players if not p.game_over]
        if len(active_players) < 2:
            print("Not enough players to continue the game!")
            return False

        self.preflop()

        remaining_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]
        if len(remaining_players) <= 1:
            if remaining_players:
                winner = remaining_players[0]
                winner.chips += self.bank_chips
                print(f"{winner.name} wins {self.bank_chips} chips by default!")
            return True

        self.flop()

        remaining_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]
        if len(remaining_players) <= 1:
            if remaining_players:
                winner = remaining_players[0]
                winner.chips += self.bank_chips
                print(f"{winner.name} wins {self.bank_chips} chips by default!")
            return True

        self.the_turn()

        remaining_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]
        if len(remaining_players) <= 1:
            if remaining_players:
                winner = remaining_players[0]
                winner.chips += self.bank_chips
                print(f"{winner.name} wins {self.bank_chips} chips by default!")
            return True

        self.river()

        remaining_players = [
            p for p in self.all_players if not p.is_folded and not p.game_over
        ]
        if len(remaining_players) > 1:
            self.card_reveal()
        elif remaining_players:
            winner = remaining_players[0]
            winner.chips += self.bank_chips
            print(f"{winner.name} wins {self.bank_chips} chips by default!")

        return True

    def start_game(self):
        round_count = 0
        while True:
            round_count += 1
            print(f"\n--- Round {round_count} ---")

            for player in self.all_players:
                if not player.game_over:
                    print(f"{player.name}: {player.chips} chips")

            if not self.full_round():
                break

            self.reset_round()

            if not self.player.game_over:
                continue_game = input(
                    "\nDo you want to play another round? (y/n): "
                ).lower()
                if continue_game != "y":
                    break


if __name__ == "__main__":
    testGame = PokerGame("test player", 1000, 2)
    testGame.start_game()
