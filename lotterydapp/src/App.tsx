import React, { useState, useEffect } from "react";
import "./App.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { toast } from 'react-toastify';

// Components
import Navbar from "./components/Navbar";
import { buyTicketOperation, endGameOperation } from "./utils/operation";
import { fetchStorage } from "./utils/tzkt";

const App: React.FC = () => {
  // Players holding lottery tickets
  const [players, setPlayers] = useState<string[]>([]);
  const [tickets, setTickets] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);

  // Set players and tickets remaining
  useEffect(() => {
    // TODO 9 - Fetch players and tickets remaining from storage
    const fetchData = async () => {
      const storage = await fetchStorage();

      if (storage) {
        setPlayers(storage.players);
        setTickets(storage.tickets_available);
      } else {
        console.error(
          "Error: Storage data is missing or in an unexpected format."
        );
      }
    };

    fetchData();
  }, []);

  // TODO 7.a - Complete onBuyTicket function
  const onBuyTicket = async () => {
    try {
      setLoading(true);
      await buyTicketOperation();
      toast.success("You have bought a ticket!");
      setTimeout(() => window.location.reload(), 6000);
    } catch (error) {
      console.error("Error while buying a ticket:", error);
      toast.error("Failed to buy ticket. Please try again.");
    }
    setLoading(false);
  };

  // TODO 11.a - Complete onEndGame function
  const onEndGame = async () => {
    try {
      setLoading(true);
      await endGameOperation();
      toast.success("The game has ended!");
      setTimeout(() => window.location.reload(), 6000);
    } catch (error) {
      console.error("Error while ending the game:", error);
      toast.error("Failed to end game. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-container">
        {/* Ticket remaining display */}
        <div className="ticket-section">
          <img
            src="https://media.istockphoto.com/id/1332163793/vector/prize-raffle-rotating-drum-with-lottery-tickets-and-lucky-winner-gift-boxes-on-dark.jpg?s=612x612&w=0&k=20&c=PpeYywgzTgD-2OFJeSFQzQ08T5KBXAty5t5b92r70W0="
            alt="Lottery Ticket"
          />
          <div className="ticket-info">Tickets remaining: {tickets}</div>
        </div>
        {/* Action Buttons */}
        <div className="action-buttons">
          {tickets > 0 ? (
            <button
              onClick={onBuyTicket}
              className="buy-ticket-btn btn-primary"
            >
              {/* TODO 7.b - Call onBuyTicket on click */}
              {/* TODO 7.c - Show "loading..." when buying operation is pending */}
              {loading ? "Loading . . ." : "Buy Ticket"}
            </button>
          ) : (
            <button onClick={onEndGame} className="end-game-btn btn-success">
              {/* TODO 11.b - Call onEndGame on click */}
              {/* TODO 11.c - Show "loading..." when buying operation is pending */}
              {loading ? "Loading . . ." : "End Game"}
            </button>
          )}
        </div>
        {/* List of Players */}
        <div className="players-section">
          <h3>Players:</h3>
          <table className="players-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Player</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(players).map(([index, player]) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{player}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer position="bottom-right" draggable pauseOnHover/>
      </div>
    </div>
  );
};

export default App;
