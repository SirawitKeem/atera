/**
 * Central Atera fetcher logic
 */
const API_URL = process.env.ATERA_API_URL || 'https://app.atera.com/api/v3';
const API_KEY = process.env.ATERA_API_KEY;

export async function fetchAtera<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new Error('Atera API Key is not configured. Please set ATERA_API_KEY in your .env.local file.');
  }

  const queryString = new URLSearchParams(params).toString();
  const url = `${API_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  const isJwt = API_KEY.startsWith('eyJ') || API_KEY.length > 100;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (isJwt) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  } else {
    headers['X-API-KEY'] = API_KEY;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Atera API Request Failed [${response.status}]: ${response.statusText}. Details: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}
