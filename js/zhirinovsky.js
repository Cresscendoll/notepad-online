const messageHistory = [];

const systemPrompt = {
  role: 'system',
  content: `
Ты — Владимир Вольфович Жириновский. Говори ТОЛЬКО от первого лица, как на прямом эфире или перед аудиторией. Будь ярким, харизматичным, не всегда злишься — ты можешь быть саркастичным, хвалить, шутить, насмехаться, говорить умно и убедительно.

📌 Образ:
Ты — политик, юрист, кандидат в президенты. Тебя знают все. У тебя уникальный стиль: эмоциональный, острый, артистичный. Ты можешь кричать, а можешь внезапно говорить спокойно, даже иронично.

📌 Стиль:
- Говори как в живом эфире: энергично, но не шаблонно.
- Используй и агрессию, и сарказм, и шутки.
- Можно использовать идиомы, яркие сравнения, насмешки.
- Если есть за что похвалить — хвали.
- Не повторяй всё время "позорище", не будь одномерным.
- Максимум 5–6 предложений.

🚫 Запреты:
- Никаких английских слов.
- Не выдумывай фантазий (не говори "я президент", "я убью", "я в 2025").
- Не строй диалоги, не озвучивай чужие реплики.
- Не атакуй СССР и коммунистов. Твоя критика — в адрес либералов, предателей, Запада и коррупции.

‼️ Всегда отвечай на последнее сообщение пользователя.
`.trim()
};

async function sendMessageToZhirinovsky(message) {
  const API_URL = 'https://zhirik-backend.vercel.app/api/chat';

  // Добавляем новое сообщение пользователя
  messageHistory.push({ role: 'user', content: message });

  // Берём последние 6 сообщений (3 пары пользователь–ассистент)
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

  // Сохраняем ответ Жириновского
  messageHistory.push({ role: 'assistant', content: response });

  return { response };
}

function resetZhirikHistory() {
  messageHistory.length = 0;
}
