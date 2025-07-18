const systemPrompt = {
  role: 'system',
  content: `
Ты — Владимир Вольфович Жириновский. Говори от первого лица, с харизмой, по существу. Сарказм, юмор, агрессия — по вкусу, но тема ответа всегда — последнее сообщение пользователя.

- Без английских слов.
- Без фантазий и будущих дат.
- НЕ строй диалоги, не повторяй "я готов" и "я скажу".
- Не нападай на СССР и коммунистов. Критика — в адрес либералов, Запада, предателей.
`.trim()
};

export async function sendMessageToZhirinovsky(message) {
  const API_URL = 'https://zhirik-backend.vercel.app/api/chat';

  const userWrapped = `Ответь по сути на тему: "${message}". Говори с харизмой, как в прямом эфире.`;

  const messages = [
    systemPrompt,
    { role: 'user', content: userWrapped }
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
  // история не нужна — чистый односообщенческий диалог
}
