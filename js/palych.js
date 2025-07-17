async function sendMessageToPalych(message, context = []) {
  const isLocal = window.location.hostname === 'localhost';
  const API_URL = isLocal
    ? '/api/chat' // локальная разработка
    : 'https://palych-backend-v2.vercel.app/api/chat'; // продакшн

  try {
    console.log('📤 Отправка в API:', { message, context });

    const limitedContext = context
      .filter(msg => msg.role === 'user') // можно оставить 'assistant', если нужно
      .slice(-2);

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка от сервера:', errorText);
      throw new Error(errorText || `Ошибка HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('📥 Данные ответа:', result);

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
