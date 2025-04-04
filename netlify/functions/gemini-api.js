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
    const { 
      apiKey, 
      prompt, 
      history = [],
      model = "gemini-1.5-flash",
      useCustomModel = false,
      customModel = "",
      temperature = 0.7,
      topK = 40,
      topP = 0.95,
      maxOutputTokens = 2048,
      isChatMode = false
    } = JSON.parse(event.body);
    
    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    // Determine which model to use
    const modelToUse = useCustomModel && customModel ? customModel : model;
    console.log(`Calling Gemini API with model: ${modelToUse} in ${isChatMode ? 'chat' : 'completion'} mode`);

    // Different endpoints for chat vs. completion
    let apiUrl;
    let payload;
    
    if (isChatMode && history.length > 0) {
      // Chat mode with history
      apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelToUse}:generateContent?key=${apiKey}`;
      payload = {
        contents: history,
        generationConfig: {
          temperature: parseFloat(temperature),
          topK: parseInt(topK),
          topP: parseFloat(topP),
          maxOutputTokens: parseInt(maxOutputTokens)
        }
      };
    } else {
      // Standard completion mode or first message in chat
      apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelToUse}:generateContent?key=${apiKey}`;
      payload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: parseFloat(temperature),
          topK: parseInt(topK),
          topP: parseFloat(topP),
          maxOutputTokens: parseInt(maxOutputTokens)
        }
      };
    }

    console.log(`API Request payload format:`, {
      url: apiUrl,
      contentsCount: payload.contents.length,
      generationConfig: payload.generationConfig
    });

    // Call Gemini API
    const response = await axios.post(
      apiUrl,
      payload,
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









































// // netlify/functions/gemini-api.js
// const axios = require('axios');

// exports.handler = async function(event, context) {
//   // Only allow POST requests
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ error: 'Method not allowed' })
//     };
//   }

//   try {
//     const { 
//       apiKey, 
//       prompt, 
//       model = "gemini-1.5-flash",
//       useCustomModel = false,
//       customModel = "",
//       temperature = 0.7,
//       topK = 40,
//       topP = 0.95,
//       maxOutputTokens = 2048
//     } = JSON.parse(event.body);
    
//     if (!apiKey) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'API key is required' })
//       };
//     }

//     // Determine which model to use
//     const modelToUse = useCustomModel && customModel ? customModel : model;
//     console.log(`Calling Gemini API with model: ${modelToUse}`);

//     // API URL with selected model
//     const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelToUse}:generateContent?key=${apiKey}`;
    
//     // Prepare request payload with generation parameters
//     const payload = {
//       contents: [
//         {
//           parts: [
//             {
//               text: prompt
//             }
//           ]
//         }
//       ],
//       generationConfig: {
//         temperature: parseFloat(temperature),
//         topK: parseInt(topK),
//         topP: parseFloat(topP),
//         maxOutputTokens: parseInt(maxOutputTokens)
//       }
//     };

//     console.log(`API Request payload:`, JSON.stringify({
//       ...payload,
//       generationConfig: {
//         ...payload.generationConfig
//       }
//     }));

//     // Call Gemini API
//     const response = await axios.post(
//       apiUrl,
//       payload,
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     console.log('Gemini API response received');
    
//     return {
//       statusCode: 200,
//       body: JSON.stringify(response.data)
//     };
//   } catch (error) {
//     console.error('Error calling Gemini API:', error.message);
    
//     let errorResponse = {
//       error: 'Failed to call Gemini API',
//       message: error.message,
//       status: error.response?.status || 'unknown',
//       statusText: error.response?.statusText || 'unknown'
//     };
    
//     // Include the error response data if available
//     if (error.response?.data) {
//       errorResponse.apiErrorDetails = error.response.data;
//     }
    
//     return {
//       statusCode: error.response?.status || 500,
//       body: JSON.stringify(errorResponse)
//     };
//   }
// }