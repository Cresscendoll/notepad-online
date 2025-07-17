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
        messages: context.concat([{ 
          role: 'user', 
          content: message 
        }])
      })
    });

    console.log('📥 Статус ответа:', response.status);
    
    const result = await response.json();
    console.log('📥 Данные ответа:', result);

    if (!response.ok || !result.response) {
      throw new Error(result.error || 'Пустой ответ от Палыча');
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
