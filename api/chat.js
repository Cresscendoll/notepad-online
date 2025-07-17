// api/chat.js
const { fetch } = require('undici'); // или node-fetch@2
module.exports = async (req, res) => {
  const API_KEY = process.env.GROQ_API_KEY;
  const BACKEND_API_URL = 'https://palych-backend-v2.vercel.app/api/chat';

  // CORS для SSR-режима Vercel — по желанию
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

    const text = await proxyRes.text(); // ⚠️ читаем как текст
    try {
      const json = JSON.parse(text); // ⚠️ и пытаемся распарсить
      return res.status(proxyRes.status).json(json);
    } catch {
      return res.status(proxyRes.status).send(text);
    }
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy failed: ' + error.message });
  }
};
