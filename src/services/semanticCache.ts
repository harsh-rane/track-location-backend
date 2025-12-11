import { getEmbedding, cosineSimilarity } from "./embedding";


let CACHE: any[] = [];
const MAX_CACHE = 50;
const SIMILARITY_THRESHOLD = 0.93;
const NEARBY_RADIUS = 500;

const normalize = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
};

const normalizedCity = (address: string) => {
  return address?.toLowerCase()?.trim() ?? "";
}
function getCityName(address: any): string {
  return (address?.city || address?.state_district || "").toLowerCase();
}


export async function searchInCache(query: string) {
  console.log("Checking semantic similarity for:", query);
  const embedding = await getEmbedding(normalize(query));

  let bestMatch = null;
  let bestScore = 0;

  for (const item of CACHE) {
    const score = cosineSimilarity(embedding, item.embedding);
    if (score > bestScore) {
      bestMatch = item;
      bestScore = score;
    }
  }

  if (bestMatch && bestScore >= SIMILARITY_THRESHOLD) {
    const queryLower = normalize(query);
    const queryCity = queryLower.split(" ").pop();   // last word of query
    const cachedCity = bestMatch.address.city?.toLowerCase();
    if (cachedCity && queryCity && cachedCity !== queryCity) {
      console.log("City mismatch skipping cache for:", query);
      return null;
    }
    bestMatch.queriesSeen.push(query);
    bestMatch.lastAccess = Date.now();
    console.log("Matched:", bestMatch?.query, "score:", bestScore);
    return {
      lat: bestMatch.lat,
      lon: bestMatch.lon,
      address: bestMatch.address,
      displayName: bestMatch.displayName,
    };
  }

  return null;
}

export async function saveToCache(
  query: string,
  lat: number,
  lon: number,
  address: any
) {
  const embedding = await getEmbedding(normalize(query));

  CACHE.push({
    query,
    lat,
    lon,
    address,
    displayName: address?.displayName,
    embedding,
    queriesSeen: [query],
    lastAccess: Date.now()
  });

  if (CACHE.length > MAX_CACHE) CACHE.shift();
}
