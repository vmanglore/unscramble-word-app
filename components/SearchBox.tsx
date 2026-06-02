"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSearch() {
    const clean = value.toLowerCase().trim();

    if (!clean) return;

    // route decision logic
    if (clean.length <= 2) {
      router.push(`/words-starting-with/${clean}`);
    } else {
      router.push(`/unscramble/${clean}`);
    }
  }

  return (
    <div className="flex gap-2">
      <input
        className="border p-2 rounded w-full"
        placeholder="Enter letters or word..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 rounded"
      >
        Search
      </button>
    </div>
  );
}