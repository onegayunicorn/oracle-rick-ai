// Cloudflare Function: same-origin proxy for model weight mirrors (optional).
export async function onRequest(context) {
  const url = new URL(context.request.url).searchParams.get('url');
  if (!url) return new Response('missing url', { status: 400 });
  const res = await fetch(url);
  return new Response(res.body, { headers: { 'cache-control': 'public, max-age=31536000' } });
}
