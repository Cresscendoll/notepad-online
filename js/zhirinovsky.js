const messageHistory = [];

async function sendMessageToZhirinovsky(message) {
  const API_URL = 'https://zhirik-backend.vercel.app/api/chat';

  // Добавляем сообщение пользователя в историю
  messageHistory.push({ role: 'user', content: message });

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messageHistory })
  });

  const json = await res.json();

  if (!res.ok) {
    return { error: json.error || 'Ошибка' };
  }

  const response = (json.response || '').trim();

  // Добавляем ответ Жириновского в историю
  messageHistory.push({ role: 'assistant', content: response });

  return { response };
}

// Сброс истории (по кнопке, например)
function resetZhirikHistory() {
  messageHistory.length = 0;
}
