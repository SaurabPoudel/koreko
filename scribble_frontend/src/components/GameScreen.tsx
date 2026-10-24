"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Avatar, { AvatarConfig } from "./Avatar";


type Player = {
  id: string;
  name: string;
  points: number;
  avatar: AvatarConfig;
  drawing?: boolean;
  you?: boolean;
};

type MsgKind = "info" | "join" | "leave" | "guess";
type Msg = { id: number; kind: MsgKind; text: string };

const c = (col: number, row = 0) => ({ col, row });

const PLAYERS: Player[] = [
  { id: "1", name: "Bubz", points: 0, drawing: true, avatar: { color: c(7), eyes: c(2, 0), mouth: c(4, 0) } },
  { id: "2", name: "ICY", points: 0, avatar: { color: c(4), eyes: c(3, 2), mouth: c(7, 1) } },
  { id: "3", name: "hdaf", points: 0, you: true, avatar: { color: c(4), eyes: c(0, 2), mouth: c(2, 1) } },
];

const MSG_COLOR: Record<MsgKind, string> = {
  info: "text-[#3a78e0]",
  join: "text-[#4cc02f]",
  leave: "text-[#d9531e]",
  guess: "text-black",
};

const INITIAL_MSGS: Msg[] = [
  { id: 1, kind: "info", text: "Bubz is drawing now!" },
  { id: 2, kind: "join", text: "Oya joined the room!" },
  { id: 3, kind: "leave", text: "Oya left the room!" },
];

function useCountdown(duration: number) {
  const [left, setLeft] = useState(duration);

  useEffect(() => {
    setLeft(duration);
    const endAt = Date.now() + duration * 1000;
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [duration]);

  return left;
}


function Clock({ seconds }: { seconds: number }) {
  const urgent = seconds <= 10;
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={`${seconds} seconds left`}
      className="absolute -left-1 -top-[10px] h-[76px] w-[76px]"
    >
      {/* bells */}
      <circle cx="13" cy="13" r="9" fill="#cfcfcf" stroke="#000" strokeWidth="3.5" />
      <circle cx="51" cy="13" r="9" fill="#cfcfcf" stroke="#000" strokeWidth="3.5" />
      {/* feet */}
      <path d="M16 56 L11 62 M48 56 L53 62" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      {/* face */}
      <circle cx="32" cy="35" r="24" fill="#fff" stroke="#000" strokeWidth="4" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="26"
        fontWeight="800"
        fill={urgent ? "#d92b2b" : "#000"}
      >
        {seconds}
      </text>
    </svg>
  );
}

function Gear() {
  return (
    <svg viewBox="0 0 24 24" className="h-11 w-11 transition-transform hover:rotate-45">
      <path
        fill="#111"
        d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
      />
    </svg>
  );
}

const THUMB =
  "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z";

function Thumb({ down, label }: { down?: boolean; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="h-[54px] w-[54px] cursor-pointer transition-transform hover:scale-110 active:scale-90"
    >
      <svg viewBox="0 0 24 24" className={`h-full w-full ${down ? "rotate-180" : ""}`}>
        <path d={THUMB} fill={down ? "#d98080" : "#86d474"} />
      </svg>
    </button>
  );
}


function PlayerRow({ p, rank, odd }: { p: Player; rank: number; odd: boolean }) {
  return (
    <li className={`relative flex h-[60px] items-center ${odd ? "bg-[#eee]" : "bg-white"}`}>
      <span className="absolute left-2 top-1 text-lg font-bold">#{rank}</span>

      <div className="w-full text-center leading-tight">
        <div className={`font-bold ${p.you ? "text-[#4a9bff]" : "text-black"}`}>
          {p.name}
          {p.you && " (You)"}
        </div>
        <div className="text-sm">{p.points} points</div>
      </div>

      {p.drawing && (
        <span className="absolute right-[52px] top-0 -rotate-12 text-2xl" aria-label="Drawing">
          ✏️
        </span>
      )}
      <div className="absolute bottom-0 right-1">
        <Avatar config={p.avatar} size={56} />
      </div>
    </li>
  );
}


export default function GameScreen({
  id,
  duration = 80,
  round = 2,
  rounds = 3,
  hint = "_______", 
}: {
  id: string;
  duration?: number;
  round?: number;
  rounds?: number;
  hint?: string;
}) {
  const seconds = useCountdown(duration);

  const [messages, setMessages] = useState<Msg[]>(INITIAL_MSGS);
  const [guess, setGuess] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const me = PLAYERS.find((p) => p.you);

  const sendGuess = (e: FormEvent) => {
    e.preventDefault();
    const text = guess.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: Date.now(), kind: "guess", text: `${me?.name}: ${text}` }]);
    setGuess("");
  };

  return (
    <div className="min-h-screen bg-[#4a2c9a] bg-[url('/img/background.png')] bg-center pb-4">
      <div className="mx-auto w-full max-w-[1640px] px-3 pt-6">
        <Image
          src="/img/logo.gif"
          alt="Logo"
          width={400}
          height={80}
          unoptimized
          priority
          className="mb-3 block h-auto w-[400px] max-w-full"
        />

        <header className="relative flex h-[60px] items-center bg-white pl-[84px] pr-3">
          <Clock seconds={seconds} />
          <h2 className="text-2xl font-bold">
            Round {round} of {rounds}
          </h2>

          <div className="absolute left-1/2 top-1 -translate-x-1/2 text-center font-mono">
            <p className="text-sm uppercase">Guess this</p>
            <p className="flex items-start justify-center">
              <span className="text-3xl leading-none tracking-[0.2em]">{hint}</span>
              <sup className="text-xs">{hint.length}</sup>
            </p>
          </div>

          <span className="ml-auto mr-4 whitespace-nowrap text-sm font-semibold">
            Room {id}
          </span>
          <button type="button" aria-label="Settings" className="cursor-pointer">
            <Gear />
          </button>
        </header>

        <div className="mt-2 grid grid-cols-1 gap-2 lg:h-[calc(100vh-190px)] lg:min-h-[560px] lg:grid-cols-[250px_1fr_375px]">
          <aside className="self-start">
            <ul className="bg-white">
              {PLAYERS.map((p, i) => (
                <PlayerRow
                  key={p.id}
                  p={p}
                  odd={i % 2 === 1}
                  rank={1 + PLAYERS.filter((o) => o.points > p.points).length}
                />
              ))}
            </ul>
          </aside>

          <section className="relative min-h-[360px] bg-white">
            <div className="absolute right-4 top-2 flex gap-2">
              <Thumb label="Like drawing" />
              <Thumb down label="Dislike drawing" />
            </div>
          </section>
          <aside className="flex h-80 min-h-0 flex-col bg-white lg:h-auto">
            <div ref={listRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="mt-auto">
                {messages.map((m, i) => (
                  <p
                    key={m.id}
                    className={`px-1 py-1 text-[17px] font-bold ${MSG_COLOR[m.kind]} ${
                      i % 2 === 1 ? "bg-[#eee]" : ""
                    }`}
                  >
                    {m.text}
                  </p>
                ))}
              </div>
            </div>

            <form onSubmit={sendGuess}>
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                maxLength={100}
                placeholder="Type your guess here..."
                className="w-full border border-neutral-400 px-2 py-2 outline-none"
              />
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}