// Обёртка с повторной попыткой только при 401
async function sendMessageWithRetry(message, context = [], retries = 1, delayMs = 400) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const result = await sendMessageToPalych(message, context);

    if (result.status === 401) {
      console.warn(`🔁 Попытка ${attempt + 1} не удалась (401):`, result.error);
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        return {
          error: 'После нескольких попыток ключ всё ещё не работает',
          status: 401
        };
      }
    } else {
      return result;
    }
  }
}

// Основная функция отправки сообщения в API Палыча
async function sendMessageToPalych(message, context = []) {
  const isLocal = window.location.hostname === 'localhost';
  const API_URL = isLocal
    ? '/api/chat' // для локальной разработки
    : 'https://palych-backend-v2.vercel.app/api/chat'; // в продакшн

  try {
    console.log('📤 Отправка в API:', { message, context });

    // Ограничим контекст только пользовательскими сообщениями (Жириновский — один)
    const limitedContext = context
      .filter(msg => msg.role === 'user')
      .slice(-5);

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

    const text = await response.text();
    let result = {};

    try {
      result = JSON.parse(text);
    } catch (jsonErr) {
      console.error('❌ Невалидный JSON:', text);
      return {
        error: 'Невалидный JSON от API',
        status: response.status
      };
    }

    if (!response.ok) {
      console.error('❌ Ошибка от сервера:', result);
      return {
        error: result.error || 'Ошибка от сервера',
        status: response.status
      };
    }

    if (!result.response) {
      return {
        error: 'Пустой ответ от Палыча',
        status: response.status
      };
    }

    if (result.usage) {
      console.log('📊 Использование токенов:', result.usage);
    }

    return {
      response: result.response,
      usage: result.usage || {},
      status: response.status
    };

  } catch (error) {
    console.error('❌ Ошибка запроса к Палычу:', error.message);
    return {
      error: error.message || 'Ошибка соединения с Палычем',
      status: 500
    };
  }
}
