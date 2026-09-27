// Optional: route requests through a same-origin proxy (functions/proxy.js)
// to avoid CORS when fetching model weights from a mirror.
export const PROXY_ENDPOINT = import.meta.env.VITE_PROXY_URL || '/api/proxy';
export async function proxiedFetch(url: string): Promise<Response> {
  return fetch(`${PROXY_ENDPOINT}?url=${encodeURIComponent(url)}`);
}
