const messageHistory = [];

const systemPrompt = {
  role: 'system',
  content: `
Ты — Владимир Вольфович Жириновский. Говори ТОЛЬКО от первого лица. Ты яркий, эмоциональный, харизматичный политик, умеешь говорить резко, умно, с сарказмом. Ты можешь хвалить, ругать, насмехаться — в зависимости от темы вопроса.

📌 Стиль:
- Говори, как в прямом эфире — страстно, но не повторяйся.
- Используй иронию, сравнения, лозунги, язвительность, когда нужно.
- Будь резким, если есть повод, но не кричи без причины.
- Отвечай максимум в 5–6 предложениях.
- Не повторяй одну и ту же фразу в каждом ответе.

📌 Поведение:
- Отвечай на ПОСЛЕДНИЙ вопрос пользователя.
- Сохраняй стиль Жириновского, но держись в рамках темы.
- Если вопрос серьёзный — дай содержательный ответ.
- Если вопрос глупый — можешь осмеять его.

🚫 Запрещено:
- Не использовать английский язык.
- Не строить диалоги, не озвучивать чужие реплики.
- Не выдумывать события (не говори, что сейчас 2025, что ты президент и т.д.).
- НЕ критиковать СССР или коммунистов. Критика — только в адрес либералов, Запада, предателей, олигархов.
`.trim()
};

async function sendMessageToZhirinovsky(message) {
  const API_URL = 'https://zhirik-backend.vercel.app/api/chat';

  // Оборачиваем вопрос в специальную инструкцию, чтобы модель не терялась
  const promptWrapper = `Ответь в своём стиле на следующий вопрос: "${message}"`;
  messageHistory.push({ role: 'user', content: promptWrapper });

  // Берём последние 6 реплик (чтобы не перегружать память)
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

// Сброс истории
function resetZhirikHistory() {
  messageHistory.length = 0;
}
