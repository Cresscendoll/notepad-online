export default async function handler(req, res) {
  const API_KEY = process.env.GROQ_API_KEY;
  const BACKEND_API_URL = 'https://zhirik-backend.vercel.app/api/chat'; // ← исправлено!

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const proxyRes = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await proxyRes.json();
    res.status(proxyRes.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy failed: ' + error.message });
  }
}
