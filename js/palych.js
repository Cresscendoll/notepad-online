async function sendMessageToPalych(message) {
  const API_URL = window.location.hostname === 'localhost'
    ? '/api/chat'
    : 'https://palych-backend-v2.vercel.app/api/chat';

  console.log('📤 Отправка темы:', message);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
  });

  const json = await res.json();
  if (!res.ok) {
    return { error: json.error || 'Ошибка от сервера', status: res.status };
  }

  return { response: json.response, usage: json.usage, status: 200 };
}
