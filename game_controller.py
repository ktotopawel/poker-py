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
            current_player.receive_cards(Deck.deal(1))
        for current_player in self.all_players:
            current_player.receive_cards(Deck.deal(1))

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

        while not all_finished:
            for i, player in enumerate(betting_order):
                if player.is_folded or player.game_over:
                    continue
                
                action_result = None
                
                if is_preflop:
                    if i === 0:
                        player.bet(small_blind)
                        action_result = 'raised'
                        continue
                    elif i === 1:
                        player.bet(big_blind)
                        action_result = 'raised'
                        continue
                    
                    self.current_stake = 50
                    
                action_result = player.take_turn(self.current_stake)
                print(f'{player.name}: {action_result}')
                
                if player.stake > self.current_stake:
                    self.current_stake = player.stake
                    players_acted = 0
                    
                players_acted += 1