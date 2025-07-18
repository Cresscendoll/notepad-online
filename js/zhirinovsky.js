async function sendMessageToZhirinovsky(message) {
  const API_URL = window.location.hostname === 'localhost'
    ? '/api/chat'
    : 'https://palych-backend-v2.vercel.app/api/chat';

  console.log('📤 Отправка сообщения Жириновскому:', message);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
  });

  const json = await res.json();
  if (!res.ok) {
    console.error('❌ Ошибка от сервера:', json);
    return { error: json.error || 'Ошибка', status: res.status };
  }

  console.log('📊 Ответ от Жириновского:', json.response, '— токены:', json.usage);
  return { response: json.response, usage: json.usage, status: 200 };
}
