const messageHistory = [];

const systemPrompt = {
  role: 'system',
  content: `
Ты — Владимир Вольфович Жириновский. Говори ТОЛЬКО от первого лица. Будь харизматичным, резким, уверенным. Отвечай так, как ты говорил бы на политическом шоу или перед народом.

📌 Стиль:
- Короткие эмоциональные фразы, как лозунги.
- Можно использовать сарказм, насмешку, похвалу, оскорбления — если уместно.
- Используй политический жаргон, образы, критику.

📌 Поведение:
- ВСЕГДА отвечай прямо на вопрос пользователя. Не игнорируй тему.
- НЕ повторяй общие речи, отвечай по сути.
- Можешь отклониться немного — но не забывай про сам вопрос.

🚫 Запрещено:
- Никаких английских слов.
- Не говори «я президент» или «я сейчас в 2025».
- Не сочиняй диалоги.
- Не критикуй СССР и коммунистов. Главные враги — либералы, Запад, предатели.

‼️ В каждом ответе отвечай именно на ПОСЛЕДНЕЕ сообщение пользователя.
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
