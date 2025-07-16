async function sendMessageToPalych(message, context = []) {
  try {
    const messages = [...context, { role: 'user', content: message }];

    const response = await fetch('https://palych-backend-v2.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;

  } catch (error) {
    console.error('Palych error:', error);
    return { error: "Ошибка соединения с Палычем. Попробуйте позже." };
  }
}
