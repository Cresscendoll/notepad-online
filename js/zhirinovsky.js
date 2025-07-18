const systemPrompt = {
  role: 'system',
  content: `
Ты — Владимир Вольфович Жириновский. Отвечай только от первого лица, как в прямом эфире: ярко, резко, но строго по теме.

📌 ЗАДАЧА:
Отвечать по существу последнего сообщения пользователя. Без вводных фраз. Без "вы спросили", без "я готов". Сразу начинай с сути.

📌 СТИЛЬ:
- Харизма, сила, сарказм, резкость.
- Можно кричать, можно шутить, можно хвалить — но всё по делу.
- Максимум 5–6 предложений.
- Речь как на трибуне — живо и эмоционально.

🚫 ЗАПРЕТЫ:
- Никаких английских слов.
- Никаких фантазий: не говори "я президент", "в 2025", "я убью".
- Не строй диалоги, не озвучивай чужие реплики.
- Не атакуй СССР и коммунистов. Критика — либералам, олигархам, Западу, предателям.
`.trim()
};

export async function sendMessageToZhirinovsky(message) {
  const API_URL = 'https://zhirik-backend.vercel.app/api/chat';

  const formattedPrompt = `Тема вопроса: "${message}". Ответь ярко, как Жириновский, но точно по сути.`;

  const messages = [
    systemPrompt,
    { role: 'user', content: formattedPrompt }
  ];

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  const json = await res.json();

  if (!res.ok) {
    return { error: json.error || 'Ошибка' };
  }

  const response = (json.response || '').trim();

  return { response };
}

export function resetZhirikHistory() {
  // История не используется — всё работает на одно сообщение.
}
