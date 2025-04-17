// netlify/functions/gemini-api.js 
const axios = require('axios'); 
exports.handler = async function(event, context) { 
  // Only allow POST requests 
  if (event.httpMethod !== 'POST') { 
    return { 
      statusCode   
      body   
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
        statusCode   
        body   
      }; 
    } 
    // Determine which model to use 
    const modelToUse = useCustomModel && customModel ? customModel    
    console.log(`Calling Gemini API with model   
    // Different endpoints for chat vs. completion 
    let apiUrl; 
    let payload; 
     
    if (isChatMode && history.length > 0) { 
      // Chat mode with history 
      apiUrl = `https   
      payload = { 
        contents   
        generationConfig   
          temperature   
          topK   
          topP   
          maxOutputTokens   
        } 
      }; 
    } else { 
      // Standard completion mode or first message in chat 
      apiUrl = `https   
      payload = { 
        contents   
          { 
            parts   
              { 
                text   
              } 
            ] 
          } 
        ], 
        generationConfig   
          temperature   
          topK   
          topP   
          maxOutputTokens   
        } 
      }; 
    } 
    console.log(`API Request payload format   
      url   
      contentsCount   
      generationConfig   
    }); 
    // Call Gemini API 
    const response = await axios.post( 
      apiUrl, 
      payload, 
      { 
        headers   
          'Content-Type'   
        } 
      } 
    ); 
    console.log('Gemini API response received'); 
     
    return { 
      statusCode   
      body   
    }; 
  } catch (error) { 
    console.error('Error calling Gemini API   
     
    let errorResponse = { 
      error   
      message   
      status   
      statusText   
    }; 
     
    // Include the error response data if available 
    if (error.response?.data) { 
      errorResponse.apiErrorDetails = error.response.data; 
    } 
     
    return { 
      statusCode   
      body   
    }; 
  } 
} 
// // netlify/functions/gemini-api.js 
// const axios = require('axios'); 
// exports.handler = async function(event, context) { 
//   // Only allow POST requests 
//   if (event.httpMethod !== 'POST') { 
//     return { 
//       statusCode   
//       body   
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
//         statusCode   
//         body   
//       }; 
//     } 
//     // Determine which model to use 
//     const modelToUse = useCustomModel && customModel ? customModel    
//     console.log(`Calling Gemini API with model   
//     // API URL with selected model 
//     const apiUrl = `https   
     
//     // Prepare request payload with generation parameters 
//     const payload = { 
//       contents   
//         { 
//           parts   
//             { 
//               text   
//             } 
//           ] 
//         } 
//       ], 
//       generationConfig   
//         temperature   
//         topK   
//         topP   
//         maxOutputTokens   
//       } 
//     }; 
//     console.log(`API Request payload   
//       ...payload, 
//       generationConfig   
//         ...payload.generationConfig 
//       } 
//     })); 
//     // Call Gemini API 
//     const response = await axios.post( 
//       apiUrl, 
//       payload, 
//       { 
//         headers   
//           'Content-Type'   
//         } 
//       } 
//     ); 
//     console.log('Gemini API response received'); 
     
//     return { 
//       statusCode   
//       body   
//     }; 
//   } catch (error) { 
//     console.error('Error calling Gemini API   
     
//     let errorResponse = { 
//       error   
//       message   
//       status   
//       statusText   
//     }; 
     
//     // Include the error response data if available 
//     if (error.response?.data) { 
//       errorResponse.apiErrorDetails = error.response.data; 
//     } 
     
//     return { 
//       statusCode   
//       body   
//     }; 
//   } 
// }