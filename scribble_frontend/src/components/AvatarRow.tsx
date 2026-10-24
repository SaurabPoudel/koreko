"use client";

import { useEffect, useState } from "react";
import Avatar, { AvatarConfig, randomCell } from "./Avatar";

const c = (col: number, row = 0) => ({ col, row });

const initial: AvatarConfig[] = [
  { color: c(0), eyes: c(0, 2), mouth: c(2, 1) },
  { color: c(1), eyes: c(4, 4), mouth: c(7, 0) },
  { color: c(2), eyes: c(2, 0), mouth: c(6, 2) },
  { color: c(3), eyes: c(5, 0), mouth: c(4, 2) },
  { color: c(4), eyes: c(3, 2), mouth: c(7, 1) },
  { color: c(5), eyes: c(6, 3), mouth: c(8, 1) },
  { color: c(6), eyes: c(9, 1), mouth: c(0, 3) },
  { color: c(7), eyes: c(2, 0), mouth: c(4, 0) },
];

export default function AvatarRow() {
  const [avatars, setAvatars] = useState(initial);
  const [ownerIndex, setOwnerIndex] = useState<number | null>(null);

  useEffect(() => {
    setOwnerIndex(Math.floor(Math.random() * initial.length));
  }, []);

  const shuffle = (index: number) => {
    setAvatars((prev) =>
      prev.map((a, i) => {
        if (i !== index) return a;
        const part = Math.random() < 0.5 ? "eyes" : "mouth"; 
        return { ...a, [part]: randomCell(part, a[part]) };
      })
    );
  };

  return (
    <section className="flex items-center justify-center">
      <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
        {avatars.map((a, i) => (
          <button
            key={i}
            type="button"
            onClick={() => shuffle(i)}
            aria-label={`Change avatar ${i + 1}`}
            className="cursor-pointer transition-transform duration-200 hover:-translate-y-2 active:scale-90"
          >
            <Avatar config={{ ...a, owner: i === ownerIndex }} size={80} />
          </button>
        ))}
      </div>
    </section>
  );
}