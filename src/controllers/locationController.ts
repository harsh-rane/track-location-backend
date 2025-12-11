import type { Request, Response } from "express";
import axios from "axios";
import { searchInCache, saveToCache } from "../services/semanticCache";
import { geocodeAddress } from "../services/geocodeService";

export async function geocode(req: Request, res: Response) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "query required" });
  }

  const cached = await searchInCache(query);
  if (cached) {
    console.log("CACHE HIT:", query, "Output:", cached.address);
    return res.json({ fromCache: true, ...cached });
  }

  const result = await geocodeAddress(query);

  await saveToCache(query, result.lat, result.lon, result.address);
  console.log("API HIT:", query, "Output:", result.address);
  return res.json({
    fromCache: false,
    lat: result.lat,
    lon: result.lon,
    address: result.address,
    displayName: result.displayName
  });
}

export async function suggest(req: Request, res: Response) {
  const query = req.query.q as string;

  if (!query || query.trim().length < 2) {
    return res.json([]);
  }

  try {
    const url = "https://nominatim.openstreetmap.org/search";

    const response = await axios.get(url, {
      params: {
        q: `${query}, Maharashtra, India`,
        format: "json",
        addressdetails: 0,
        // limit: 5
      },
      headers: {
        "User-Agent": "track-location-demo"
      }
    });

    const list = response.data as any[];

    const suggestions = list.map((item) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }));

    return res.json(suggestions);
  } catch (err) {
    console.error("Suggestion error:", err);
    return res.json([]);
  }
}