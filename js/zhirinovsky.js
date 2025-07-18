async function sendMessageToZhirinovsky(message) {
  const API_URL = window.location.hostname === 'localhost' 
    ? '/api/chat' 
    : 'https://palych-backend-v2.vercel.app/api/chat';

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: message }] })
  });

  const json = await res.json();
  
  if (!res.ok) {
    return { error: json.error || 'Ошибка' };
  }

  // Фильтруем ответы, удаляя упоминания Палыча
  let filteredResponse = json.response
    .replace(/Палыч:/g, '')
    .replace(/Голубчик,/g, '')
    .replace(/душа моя/g, '')
    .trim();

  // Добавляем подпись Жириновского, если её нет
  if (!filteredResponse.startsWith('Жириновский:')) {
    filteredResponse = 'Жириновский: ' + filteredResponse;
  }

  return { response: filteredResponse };
}
