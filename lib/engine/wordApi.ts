type DatamuseWord = {
  word?: string;
};

export async function fetchWordsFromAPI(query: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?sp=${query}&max=100`
    );

    if (!res.ok) return [];

    const data = (await res.json()) as DatamuseWord[];

    return data
      .map((item) => item.word)
      .filter((word): word is string => typeof word === "string");
  } catch (err) {
    console.error("wordApi error:", err);
    return [];
  }
}
