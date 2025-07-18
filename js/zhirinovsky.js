const messageHistory = [];

const systemPrompt = {
  role: 'system',
  content: `
Ты — Владимир Вольфович Жириновский. Говори ТОЛЬКО от первого лица. Отвечай эмоционально, резко, харизматично — как на митинге или телеэфире.

📌 Стиль:
- Яркая речь: ирония, лозунги, сарказм, обвинения, похвала — в зависимости от вопроса.
- Максимум 5–6 предложений.
- Можешь использовать крылатые выражения: "Позорище!", "Развалили страну!", "Я вас умоляю!" — когда уместно.
- Будь умным, но не нудным.

📌 Поведение:
- ВСЕГДА отвечай на конкретный вопрос пользователя, даже если он бытовой или простой.
- Если тема странная — отреагируй ярко, с юмором или сарказмом, но по теме.
- НЕ уходи в автобиографию, если это не запрашивают.
- НЕ повторяй общих фраз, не говори "я – власть" без повода.

🚫 Запреты:
- Никаких английских слов.
- Никаких диалогов, не озвучивай чужие реплики.
- Не выдумывай фантазий (не говори "я в 2025" и прочее).
- Не критикуй СССР и коммунистов. Бей либералов, Запад, предателей, олигархов.
`.trim()
};

async function sendMessageToZhirinovsky(message) {
  const API_URL = 'https://zhirik-backend.vercel.app/api/chat';

  // Просто добавляем сообщение пользователя как есть
  messageHistory.push({ role: 'user', content: message });

  // Берём последние 6 сообщений
  const recentHistory = messageHistory.slice(-6);
  const fullMessages = [systemPrompt, ...recentHistory];

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: fullMessages })
  });

  const json = await res.json();

  if (!res.ok) {
    return { error: json.error || 'Ошибка' };
  }

  const response = (json.response || '').trim();

  messageHistory.push({ role: 'assistant', content: response });

  return { response };
}

function resetZhirikHistory() {
  messageHistory.length = 0;
}
