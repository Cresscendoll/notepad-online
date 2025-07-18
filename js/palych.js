// Оптимизированное p alych.js — только Жириновский

async function sendMessageWithRetry(message, context = [], retries = 1, delayMs = 400) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const result = await sendMessageToPalych(message, context);
    if (result.status === 401) {
      console.warn(`🔁 Попытка ${attempt + 1} провалилась (401):`, result.error);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        return { error: 'Ключ не работает после попыток', status: 401 };
      }
    } else return result;
  }
}

async function sendMessageToPalych(message, context = []) {
  const API_URL = window.location.hostname === 'localhost'
    ? '/api/chat'
    : 'https://palych-backend-v2.vercel.app/api/chat';
  console.log('📤 API отправка:', { message, context });

  const contextMsgs = context
    .filter(msg => msg.role === 'user')
    .slice(-5);

  const body = { messages: [...contextMsgs, { role: 'user', content: message }] };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch {
    return { error: 'Невалидный JSON от API', status: res.status };
  }

  if (!res.ok) {
    return { error: json.error || 'Ошибка от сервера', status: res.status };
  }
  if (!json.response) {
    return { error: 'Пустой ответ от Жириновского', status: res.status };
  }

  console.log('📊 Токены:', json.usage);
  return { response: json.response, usage: json.usage, status: res.status };
}
