"use client";

import { useState } from "react";
import { mumbaiLocalities } from "@/lib/mumbai-localities";

export default function AddressAutocomplete({ value, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matches =
    value.length > 0
      ? mumbaiLocalities
          .filter((place) => place.toLowerCase().startsWith(value.toLowerCase()))
          .slice(0, 6)
      : [];

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Start typing your area (e.g. Malad)"
        className="w-full rounded-xl border border-cream/15 bg-transparent px-4 py-3 text-cream placeholder:text-cream/30 focus:border-yellow/50 focus:outline-none"
      />

      {showSuggestions && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-xl border border-cream/15 bg-bg-glow shadow-lg">
          {matches.map((place) => (
            <li key={place}>
              <button
                type="button"
                onMouseDown={() => {
                  onChange(place);
                  setShowSuggestions(false);
                }}
                className="block w-full px-4 py-2 text-left text-cream hover:bg-yellow/10"
              >
                {place}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}