import type { MetadataRoute } from "next";
import signatureMap from "@/data/compiled/signatureMap.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://unscramblewordnow.com";

  const unscramblePages = Object.keys(signatureMap).map((key) => ({
    url: `${baseUrl}/unscramble/${key}`,
    lastModified: new Date(),
  }));

  const wordsFromLettersPages = Object.keys(signatureMap).map((key) => ({
    url: `${baseUrl}/words-from-letters/${key}`,
    lastModified: new Date(),
  }));

  const letters = "abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({
    url: `${baseUrl}/words-starting-with/${l}`,
    lastModified: new Date(),
  }));

  const endings = ["ing", "ed", "er", "s"].map((s) => ({
    url: `${baseUrl}/words-ending-with/${s}`,
    lastModified: new Date(),
  }));

  const lengths = Array.from({ length: 15 }, (_, i) => ({
    url: `${baseUrl}/word-length/${i + 1}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/words-from-letters`,
      lastModified: new Date(),
    },
    ...unscramblePages,
    ...wordsFromLettersPages,
    ...letters,
    ...endings,
    ...lengths,
  ];
}
