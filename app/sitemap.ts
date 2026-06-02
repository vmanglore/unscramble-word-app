import signatureMap from "@/data/compiled/signatureMap.json";

export default function sitemap() {
  const baseUrl = "https://your-domain.com";

  const unscramblePages = Object.keys(signatureMap).map((key) => ({
    url: `${baseUrl}/unscramble/${key}`,
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
    ...unscramblePages,
    ...letters,
    ...endings,
    ...lengths,
  ];
}