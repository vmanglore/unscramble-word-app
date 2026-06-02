export async function fetchWordsFromAPI(query: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?sp=${query}&max=100`
    );

    if (!res.ok) return [];

    const data = await res.json();

    return data.map((item: any) => item.word);
  } catch (err) {
    console.error("wordApi error:", err);
    return [];
  }
}