async function sendMessageToPalych(message, context = []) {
  const API_URL = 'https://palych-backend-v2.vercel.app/api/chat';
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // API ключ должен передаваться через сервер, а не из браузера
      },
      body: JSON.stringify({
        messages: context.concat([{ 
          role: 'user', 
          content: message 
        }])
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Palych API error:', error);
    return { 
      error: "Ошибка соединения с сервером",
      status: 500
    };
  }
}
