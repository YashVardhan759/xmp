// netlify/functions/gemini-api.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { apiKey, prompt, model = "gemini-2.0-flash" } = JSON.parse(event.body);
    
    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    console.log(`Calling Gemini API with model: ${model}`);

    // Updated API URL - this is the current endpoint format for Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    
    console.log(`API URL: ${apiUrl.replace(apiKey, '***')}`);

    // Call Gemini API
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Gemini API response received');
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    
    let errorResponse = {
      error: 'Failed to call Gemini API',
      message: error.message,
      status: error.response?.status || 'unknown',
      statusText: error.response?.statusText || 'unknown'
    };
    
    // Include the error response data if available
    if (error.response?.data) {
      errorResponse.apiErrorDetails = error.response.data;
    }
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(errorResponse)
    };
  }
}