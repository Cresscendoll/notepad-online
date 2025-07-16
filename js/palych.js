async function sendMessageToPalych(message, context = []) {
  const API_URL = 'https://palych-backend-v2.vercel.app/api/chat';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          ...context.filter(msg => msg.role && msg.content),
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `HTTP error ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Ошибка API:', error.message);
    return { 
      error: "Сервер временно недоступен. Попробуйте позже.",
      status: error.message.includes('500') ? 'server_error' : 'connection_error'
    };
  }
}
