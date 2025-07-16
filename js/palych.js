async function sendMessageToPalych(message, context = []) {
  // Добавляем таймаут для запроса (30 секунд)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    // Формируем полный контекст сообщений
    const messages = [
      ...context.filter(msg => msg.role && msg.content), // Фильтруем некорректные сообщения
      { role: 'user', content: message }
    ];

    const response = await fetch('https://palych-backend-v2.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal: controller.signal
    });

    clearTimeout(timeoutId); // Отменяем таймаут при успешном ответе

    // Проверяем статус ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    
    // Дополнительная проверка структуры ответа
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    return data;

  } catch (error) {
    clearTimeout(timeoutId); // Очищаем таймаут при ошибке
    
    console.error('Palych API error:', error);
    
    // Возвращаем более информативное сообщение об ошибке
    return { 
      error: error.message.includes('aborted') 
        ? "Превышено время ожидания ответа от сервера" 
        : error.message.includes('Failed to fetch')
        ? "Ошибка соединения с сервером"
        : "Произошла ошибка при обработке вашего запроса",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}
