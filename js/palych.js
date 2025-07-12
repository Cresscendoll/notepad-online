async function sendMessageToPalych(message, context) {
  try {
    const response = await fetch('https://your-backend-url.vercel.app/api', {
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
