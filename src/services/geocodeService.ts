import axios from "axios";

export async function geocodeAddress(query: string) {
  const url = "https://nominatim.openstreetmap.org/search";

  const res = await axios.get(url, {
    params: {
      q: query,
      format: "json",
      addressdetails: 1,
      limit: 1
    },
    headers: {
      "User-Agent": "geo-app-demo"
    }
  });

  if (!res.data.length) throw new Error("Address not found.");

  const item = res.data[0];

  return {
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    address: item.address,
    displayName: item.display_name
  };
}
