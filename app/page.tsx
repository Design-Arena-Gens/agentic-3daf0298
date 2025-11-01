"use client";

import { useMemo, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;

function calculateWinner(cells: Cell[]): { winner: Player; line: number[] } | null {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a] as Player, line: [a, b, c] };
    }
  }
  return null;
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });

  const { winner, isDraw, winningLine } = useMemo(() => {
    const result = calculateWinner(board);
    return {
      winner: result?.winner ?? null,
      isDraw: board.every((c) => c !== null) && !result,
      winningLine: result?.line ?? [],
    } as { winner: Player | null; isDraw: boolean; winningLine: number[] };
  }, [board]);

  const currentPlayer: Player = xIsNext ? "X" : "O";

  function handleClick(index: number) {
    if (board[index] || winner) return;
    const nextBoard = board.slice();
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    const w = calculateWinner(nextBoard);
    if (w) {
      setScores((s) => ({ ...s, [w.winner]: s[w.winner] + 1 }));
    } else {
      setXIsNext((prev) => !prev);
    }
  }

  function resetBoard(nextStarter: Player | "toggle" = "toggle") {
    setBoard(Array(9).fill(null));
    if (nextStarter === "toggle") {
      setXIsNext((prev) => !prev);
    } else {
      setXIsNext(nextStarter === "X");
    }
  }

  function resetMatch() {
    setScores({ X: 0, O: 0 });
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tic Tac Toe
        </h1>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {board.map((cell, idx) => {
            const isWinning = winningLine.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                className={[
                  "aspect-square w-full rounded-xl border text-4xl font-bold transition",
                  "flex items-center justify-center select-none",
                  "border-black/10 dark:border-white/10",
                  cell
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                  isWinning ? "ring-2 ring-emerald-500" : "",
                ].join(" ")}
                disabled={Boolean(winner)}
                aria-label={`Cell ${idx + 1}`}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            {winner && (
              <span>
                Winner: <span className="font-semibold">{winner}</span>
              </span>
            )}
            {!winner && !isDraw && (
              <span>
                Turn: <span className="font-semibold">{currentPlayer}</span>
              </span>
            )}
            {isDraw && <span>Draw</span>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => resetBoard("toggle")}
              className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              New Round
            </button>
            <button
              onClick={resetMatch}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Reset Match
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-xl border border-black/10 p-3 dark:border-white/10">
            <div className="text-zinc-500 dark:text-zinc-400">X</div>
            <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{scores.X}</div>
          </div>
          <div className="rounded-xl border border-black/10 p-3 dark:border-white/10">
            <div className="text-zinc-500 dark:text-zinc-400">O</div>
            <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{scores.O}</div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          First move alternates each round. Click New Round after finishing.
        </p>
      </main>
    </div>
  );
}
