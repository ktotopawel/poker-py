class Player:
    def __init__(self, name, chips=1000):
        self.name = name
        self.hand = []
        self.chips = chips
    
    def get_cards(self, cards):
        for card in cards:
            self.hand.append(card)
        
    def __str__(self):
        return f'{self.name}: {self.chips} chips'