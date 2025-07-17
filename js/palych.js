async function sendMessageToPalych(message, context = []) {
  // 🛠️ Используй локальный API на том же домене, где размещён frontend
  const API_URL = '/api/chat';

  try {
    console.log('📤 Отправка в API:', { message, context });

    const limitedContext = context
      .filter(msg => msg.role === 'user') // или оставить assistant, если нужно
      .slice(-2); // последние 2 сообщения

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [...limitedContext, { role: 'user', content: message }]
      })
    });

    console.log('📥 Статус ответа:', response.status);

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      const rawText = await response.text();
      console.error('⚠️ Не JSON, текст ответа:', rawText);
      throw new Error('Невалидный JSON от сервера: ' + rawText);
    }

    console.log('📥 Данные ответа:', result);

    if (!response.ok) {
      throw new Error(result?.error || `Ошибка HTTP ${response.status}`);
    }

    if (!result.response) {
      throw new Error('Пустой ответ от Палыча');
    }

    if (result.usage) {
      console.log('📊 Использование токенов:', result.usage);
    }

    return {
      response: result.response,
      usage: result.usage || {}
    };

  } catch (error) {
    console.error('❌ Ошибка запроса к Палычу:', error.message);
    return {
      error: error.message || 'Ошибка соединения с Палычем',
      status: 500
    };
  }
}
