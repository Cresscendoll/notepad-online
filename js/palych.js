async function sendMessageToPalych(message, context = []) {
  const API_URL = 'https://palych-backend-v2.vercel.app/api/chat';

  try {
    console.log('📤 Отправка в API:', { message, context });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [...context, { role: 'user', content: message }]
      })
    });

    console.log('📥 Статус ответа:', response.status);

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('⚠️ Не удалось распарсить JSON:', parseError);
      throw new Error('Невалидный JSON от сервера');
    }

    console.log('📥 Данные ответа:', result);

    if (!response.ok) {
      throw new Error(result?.error || `Ошибка HTTP ${response.status}`);
    }

    if (!result.response) {
      throw new Error('Пустой ответ от Палыча');
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
