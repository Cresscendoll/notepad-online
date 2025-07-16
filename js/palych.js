async function sendMessageToPalych(message, context = []) {
  const API_URL = '/api/proxy/chat'; // Ваш сервер-посредник

  try {
    console.log('Sending request to proxy:', { message, context }); // Отладка
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
    
    console.log('Response status:', response.status); // Отладка
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data); // Отладка
    return data;
  } catch (error) {
    console.error('Palych API error:', error, error.stack);
    return { 
      error: error.message || 'Ошибка соединения с сервером',
      status: 500
    };
  }
}
