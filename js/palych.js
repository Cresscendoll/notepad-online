async function sendMessageToPalych(message, context = []) {
  const API_URL = '/api/proxy/chat';

  try {
    console.log('Sending request to proxy:', { message, context });
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
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Если JSON не удалось распарсить, читаем текст ответа
        const errorText = await response.text();
        console.error('Non-JSON response:', errorText.slice(0, 100));
        errorData = { error: `Server error: ${response.status} ${errorText.slice(0, 100)}` };
      }
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Palych API error:', error, error.stack);
    return { 
      error: error.message || 'Ошибка соединения с сервером',
      status: 500
    };
  }
}
