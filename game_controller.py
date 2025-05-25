from deck import Deck
from player import Player, CPUPlayer


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

    def betting_round(self, is_preflop=False):
        start_index = 0
        all_finished = False
        big_blind = 50
        small_blind = big_blind / 2
        players_acted = 0

        for i, player in enumerate(self.all_players):
            if player.is_dealer:
                start_index = (i + 1) % len(self.all_players)
                break

        betting_order = self.all_players[start_index:] + self.all_players[:start_index]

        if is_preflop:
            self.all_players[start_index].bet(small_blind)
            self.all_players[start_index + 1].bet(small_blind)
            start_index = start_index + 2

        while not all_finished:
            if players_acted == len(self.all_players) - 1:
                all_finished = True

    # biały kleszcz

    def preflop(self):
        self.deal_cards()
        print(
            f"All cards dealt. Your cards: {', '.join(str(card) for card in self.player.hand)}"
        )
        self.betting_round(True)

    def flop(self):
        self.deck.deal(1)
        print("First card burned")
        self.table_cards.extend(self.deck.deal(3))
        print(f"Flop: {', '.join(str(card) for card in self.table_cards)}")

        self.betting_round(False)


testGame = PokerGame("test player", 1000, 2)
testGame.preflop()
testGame.flop()
