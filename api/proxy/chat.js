const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const PALYCH_API_URL = 'https://palych-backend-v2.vercel.app/api/chat';
  const API_KEY = process.env.PALYCH_API_KEY;

  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://zmtk.my');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    if (!API_KEY) {
      console.error('PALYCH_API_KEY is not set in environment variables');
      return res.status(500).json({ error: 'API key is missing' });
    }

    const response = await fetch(PALYCH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText || `Backend API error: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
