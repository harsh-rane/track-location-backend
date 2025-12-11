// TURN TEXT INTO A FIXED VECTOR (mock but deterministic)
export async function getEmbedding(text: string): Promise<number[]> {
  const vec = new Array(16).fill(0);
  [...text].forEach((char, i) => {
    vec[i % 16] += char.charCodeAt(0);
  });
  return vec;
}

// cosine similarity
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
