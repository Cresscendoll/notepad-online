async function sendMessageToPalych(message, context = []) {
  const API_URL = 'https://palych-backend-v2.vercel.app/api/chat';

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
      const responseBody = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(responseBody);
      } catch (e) {
        console.error('Non-JSON response:', responseBody.slice(0, 100));
        errorData = { error: `Server error: ${response.status} ${responseBody.slice(0, 100)}` };
      }
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Palych API error:', error.message, error.stack);
    return { 
      error: error.message || 'Ошибка соединения с сервером',
      status: 500
    };
  }
}
