const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const PALYCH_API_URL = 'https://palych-backend-v2.vercel.app/api/chat';
  const API_KEY = process.env.GROQ_API_KEY;

  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://zmtk.my');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Ответ на preflight-запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Checking GROQ_API_KEY:', API_KEY ? `Key present (starts with: ${API_KEY.slice(0, 5)}...)` : 'Key missing');
    if (!API_KEY) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'API key is missing' });
    }

    console.log('Proxying request to:', PALYCH_API_URL);
    console.log('Request body:', req.body);

    const response = await fetch(PALYCH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText || `Backend API error: ${response.status}` });
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message, error.stack);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
