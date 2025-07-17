const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const API_KEY = process.env.GROQ_API_KEY;
  const BACKEND_API_URL = 'https://palych-backend-v2.vercel.app/api/chat';

  // Обработка CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // или ограничить
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Ответ preflight
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

    // 💡 Сохраняем данные сразу
    const status = proxyRes.status;
    const contentType = proxyRes.headers.get('content-type') || '';

    let data;
    if (contentType.includes('application/json')) {
      data = await proxyRes.json();
    } else {
      const text = await proxyRes.text();
      data = { error: 'Не JSON ответ от сервера', raw: text };
    }

    res.status(status).json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy failed: ' + error.message });
  }
};
