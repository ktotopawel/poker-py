from deck import Deck
from player import Player


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
        self.big_blind = big_blind

    def add_cpu(self, cpu_num):
        cpu_arr = []
        for i in range(cpu_num):
            cpu_arr.append(Player(name=f"CPU{i}"))
        return cpu_arr

    def receive_bet(self, bet):
        self.bank_chips += bet

    def pre_flop(self):
        for i, player in enumerate(self.all_players):
            if player.is_dealer:
                self.receive_bet(self.all_players[i + 1].bet(self.big_blind / 2))
                self.receive_bet(self.all_players[i + 2].bet(self.big_blind))
