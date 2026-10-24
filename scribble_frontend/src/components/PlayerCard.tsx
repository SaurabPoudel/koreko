"use client";

import { useState } from "react";
import Avatar, { ATLAS, AvatarConfig, Cell } from "./Avatar";

type Layer = "color" | "eyes" | "mouth";

const LANGUAGES = [
  "English",
  "Deutsch",
  "Español",
  "Français",
  "Italiano",
  "Nederlands",
  "Polski",
  "Português",
  "Türkçe",
  "Русский",
];

// Treat each atlas as a flat list: index = row * cols + col
const total = (l: Layer) => ATLAS[l].cols * ATLAS[l].rows;
const toIndex = (l: Layer, c: Cell) => c.row * ATLAS[l].cols + c.col;
const toCell = (l: Layer, i: number): Cell => ({
  col: i % ATLAS[l].cols,
  row: Math.floor(i / ATLAS[l].cols),
});
const step = (l: Layer, c: Cell, dir: 1 | -1): Cell =>
  toCell(l, (toIndex(l, c) + dir + total(l)) % total(l));
const randomOf = (l: Layer): Cell =>
  toCell(l, Math.floor(Math.random() * total(l)));

function Arrow({
  dir,
  label,
  onClick,
}: {
  dir: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="h-[34px] w-[34px] cursor-pointer transition-transform hover:scale-110 active:scale-90"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="square"
        className={`h-full w-full ${dir === "right" ? "[transform:scaleX(-1)]" : ""}`}
      >
        <path d="M15 4 L7 12 L15 20" stroke="#000" strokeWidth="7" />
        <path d="M15 4 L7 12 L15 20" stroke="#fff" strokeWidth="3" />
      </svg>
    </button>
  );
}

function Dice() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#b9b3e6" stroke="#2a1a6e" strokeWidth="2" />
      {[[8, 8], [16, 8], [12, 12], [8, 16], [16, 16]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#2a1a6e" />
      ))}
    </svg>
  );
}

export default function PlayerCard() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("English");
  const [avatar, setAvatar] = useState<AvatarConfig>({
    color: { col: 0, row: 0 },
    eyes: { col: 0, row: 0 },
    mouth: { col: 0, row: 0 },
  });

  // Arrow rows, top to bottom: eyes, mouth, color
  const rows: { layer: Layer; label: string }[] = [
    { layer: "eyes", label: "eyes" },
    { layer: "mouth", label: "mouth" },
    { layer: "color", label: "color" },
  ];

  const change = (layer: Layer, dir: 1 | -1) =>
    setAvatar((a) => ({ ...a, [layer]: step(layer, a[layer], dir) }));

  const randomize = () =>
    setAvatar({
      color: randomOf("color"),
      eyes: randomOf("eyes"),
      mouth: randomOf("mouth"),
    });

  const payload = () => ({ name: name.trim(), language, avatar });

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault(); // Enter key in the name box also lands here
    console.log("play", payload()); // TODO: join a public game
  };

  const handleCreatePrivate = () => {
    console.log("create private room", payload()); // TODO: create a room
  };

  return (
    <form
      onSubmit={handlePlay}
      className="flex w-[500px] max-w-full flex-col gap-3 bg-black/20 p-[18px]"
    >
      {/* Form section: name + language (42px) */}
      <div className="flex h-[42px] gap-[6px]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="Enter your name"
          className="min-w-0 flex-1 rounded-[3px] bg-white px-3 text-lg font-bold text-neutral-800 outline-none placeholder:font-normal placeholder:text-neutral-400"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-[150px] rounded-[3px] bg-white px-2 text-lg text-neutral-800 outline-none"
        >
          {LANGUAGES.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Avatar section (150px) */}
      <div className="relative flex h-[150px] items-center justify-center gap-6 bg-black/20">
        <div className="flex h-[126px] flex-col justify-between">
          {rows.map((r) => (
            <Arrow key={r.layer} dir="left" label={`Previous ${r.label}`} onClick={() => change(r.layer, -1)} />
          ))}
        </div>

        <Avatar config={avatar} size={110} />

        <div className="flex h-[126px] flex-col justify-between">
          {rows.map((r) => (
            <Arrow key={r.layer} dir="right" label={`Next ${r.label}`} onClick={() => change(r.layer, 1)} />
          ))}
        </div>

        <button
          type="button"
          aria-label="Randomize avatar"
          onClick={randomize}
          className="absolute right-3 top-3 cursor-pointer transition-transform hover:rotate-12 hover:scale-110 active:scale-90"
        >
          <Dice />
        </button>
      </div>

      {/* Button section: Play (68px) + gap + Create Private Room (50px) */}
      <button
        type="submit"
        className="h-[68px] w-full cursor-pointer rounded-[3px] bg-[#4de338] text-4xl font-extrabold text-white [text-shadow:2px_2px_0_rgba(0,0,0,.25)] transition hover:brightness-105 active:translate-y-px"
      >
        Play!
      </button>
      <button
        type="button"
        onClick={handleCreatePrivate}
        className="h-[50px] w-full cursor-pointer rounded-[3px] bg-[#2c8fe8] text-xl font-bold text-white transition hover:brightness-105 active:translate-y-px"
      >
        Create Private Room
      </button>
    </form>
  );
}