import smartpy as sp

# A SmartPy module
@sp.module
def main():
    # A class of contracts
    class Lottery(sp.Contract):
        def __init__(self):
            self.data = sp.record(
                players = {},
                ticket_cost = sp.tez(1),
                tickets_available = sp.nat(5),
                max_tickets = sp.nat(5),
            )
            
        @sp.entrypoint
        def buy_ticket(self):
            assert self.data.tickets_available > 0, "NO_TICKETS_AVAILABLE"
            assert sp.amount >= self.data.ticket_cost, "INVALID_AMOUNT"
            self.data.players[sp.len(self.data.players)] = sp.sender
            self.data.tickets_available = sp.as_nat(self.data.tickets_available - 1)
    
            # Return extra tez balance to the sender
            extra_balance = sp.amount - self.data.ticket_cost
            if extra_balance > sp.mutez(0):
                sp.send(sp.sender, extra_balance)

        @sp.entrypoint
        def end_game(self):
    
            # Sanity checks
            assert self.data.tickets_available == 0, "GAME_IS_YET_TO_END"
    
            # Pick a winner
            winner_id = sp.mod(sp.as_nat(sp.now - sp.timestamp(0)), self.data.max_tickets)
            winner_address = self.data.players[winner_id]
    
            # Send the reward to the winner
            sp.send(winner_address, sp.balance)
    
            # Reset the game
            self.data.players = {}
            self.data.tickets_available = self.data.max_tickets


# Tests
if "main" in __name__:
    @sp.add_test()
    def test():
        scenario = sp.test_scenario("Lottery", main)
        scenario.h1("Lottery Contract")
        
        admin = sp.test_account("admin")
        gagan = sp.test_account("gagan")
        jatin = sp.test_account("jatin")
        mahi = sp.test_account("mahi")
        soodit = sp.test_account("soodit")
        zoya = sp.test_account("zoya")
    
        scenario.h1("Accounts")
        scenario.show([admin, gagan, jatin, mahi, soodit, zoya])
        lottery = main.Lottery()
        scenario += lottery
        
        # buy_ticket
        scenario.h2("buy_ticket (valid test)")
        lottery.buy_ticket(_amount = sp.tez(1), _sender = gagan)
        lottery.buy_ticket(_amount = sp.tez(2), _sender = jatin)
        lottery.buy_ticket(_amount = sp.tez(3), _sender = mahi)
        lottery.buy_ticket(_amount = sp.tez(1), _sender = soodit)
        lottery.buy_ticket(_amount = sp.tez(2), _sender = zoya)
    
        scenario.h2("buy_ticket (failure test)")
        lottery.buy_ticket(_amount = sp.tez(1), _sender = gagan, _valid = False)
    
        # end_game
        scenario.h2("end_game (valid test)")
        lottery.end_game(_sender = admin, _now = sp.timestamp(20))