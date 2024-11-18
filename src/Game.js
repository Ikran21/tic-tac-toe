import React, { useState } from "react";
import GameGrid from "./GameGrid.js";

function Game() {
   const [moves, setMoves] = useState(new Array(9).fill(""));
   const [turn, setTurn] = useState("X");
   const [gameOver, setGameOver] = useState(false);
   const [winner, setWinner] = useState(null);

   function checkGameStatus(updatedMoves) {
      const winningCombos = [
         [0, 1, 2],
         [3, 4, 5],
         [6, 7, 8],
         [0, 3, 6],
         [1, 4, 7],
         [2, 5, 8],
         [0, 4, 8],
         [2, 4, 6],
      ];

      for (const combo of winningCombos) {
         const [a, b, c] = combo;
         if (updatedMoves[a] && updatedMoves[a] === updatedMoves[b] && updatedMoves[a] === updatedMoves[c]) {
            return updatedMoves[a];
         }
      }

      if (updatedMoves.every((square) => square !== "")) {
         return "Draw";
      }

      return null;
   }

   function computerMove(updatedMoves) {
      // Function to find the best move for the computer
      function findBestMove(player) {
         const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
         ];

         for (const combo of winningCombos) {
            const [a, b, c] = combo;
            const values = [updatedMoves[a], updatedMoves[b], updatedMoves[c]];
            if (values.filter((value) => value === player).length === 2 && values.includes("")) {
               return combo[values.indexOf("")];
            }
         }
         return null;
      }

      // Check for a winning move
      let move = findBestMove("O");
      if (move === null) {
         // Check for a blocking move
         move = findBestMove("X");
      }
      if (move === null) {
         // Choose a random move
         const availableMoves = updatedMoves
            .map((value, index) => (value === "" ? index : null))
            .filter((index) => index !== null);
         move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }

      return move;
   }

   function gridClick(whichSquare) {
      if (moves[whichSquare] === "" && !gameOver) {
         const updatedMoves = [...moves];
         updatedMoves[whichSquare] = "X";
         setMoves(updatedMoves);

         const result = checkGameStatus(updatedMoves);
         if (result) {
            setWinner(result);
            setGameOver(true);
         } else {
            // Computer's turn
            const computerChoice = computerMove(updatedMoves);
            if (computerChoice !== null) {
               updatedMoves[computerChoice] = "O";
               setMoves(updatedMoves);

               const computerResult = checkGameStatus(updatedMoves);
               if (computerResult) {
                  setWinner(computerResult);
                  setGameOver(true);
               }
            }
         }
      }
   }

   function newGame() {
      setMoves(new Array(9).fill(""));
      setTurn("X");
      setGameOver(false);
      setWinner(null);
   }

   return (
      <>
         <h1>Tic-Tac-Toe</h1>
         <GameGrid moves={moves} click={gridClick} />
         <p>
            {gameOver
               ? winner === "Draw"
                  ? "It's a draw!"
                  : `Winner: ${winner}`
               : `Turn: ${turn}`}
         </p>
         <p>
            <button onClick={newGame}>New Game</button>
         </p>
      </>
   );
}

export default Game;
