async function sendMessageToPalych(message, context) {
  try {
    const response = await fetch('https://palych-backend-v2.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, context })
    });
    return await response.json();
  } catch (error) {
    console.error('Palych error:', error);
    return { error: "Палыч временно недоступен" };
  }
}
