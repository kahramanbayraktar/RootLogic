
// Helper to interact with Google's Generative AI (Gemini / Imagen) API via REST

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
// Default model fallback if env var is missing
const DEFAULT_MODEL = import.meta.env.VITE_GOOGLE_IMAGE_MODEL || 'imagen-3.0-generate-001';

if (!API_KEY || API_KEY.includes('YOUR_GOOGLE')) {
  console.warn('VITE_GOOGLE_API_KEY is missing or invalid in .env');
}

export interface ImageGenerationResponse {
  url?: string;
  base64?: string;
  error?: string;
}

/**
 * Generates an image using Google's Generative AI
 */
export async function generateImageWithGemini(
  prompt: string, 
  model: string = DEFAULT_MODEL
): Promise<ImageGenerationResponse> {
  
  if (!API_KEY) {
    return { error: 'Missing VITE_GOOGLE_API_KEY configuration.' };
  }

  // Determine endpoint based on model name pattern logic
  // For standard Gemini text/multimodal: v1beta/models/gemini-pro:generateContent
  // For Imagen: v1beta/models/imagen-4.0-generate-001:predict
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${API_KEY}`;
  
  try {
    console.log(`Calling Google AI (${model}) for image generation...`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
          personGeneration: "allow_adult" // Standard param for realistic images if allowed
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI Error:', errorText);
      return { error: `API Error: ${response.status} ${response.statusText}` };
    }

    const data = await response.json();
    
    // Parse response. Structure typically:
    // { predictions: [ { bytesBase64Encoded: "...", mimeType: "image/png" } ] }
    if (data.predictions && data.predictions.length > 0) {
      const prediction = data.predictions[0];
      
      // If base64 is returned
      if (prediction.bytesBase64Encoded) {
        const mimeType = prediction.mimeType || 'image/png';
        return { 
          base64: `data:${mimeType};base64,${prediction.bytesBase64Encoded}`
        };
      }
      
      // If a URL is returned (rare for :predict but possible on some endpoints)
      if (prediction.url) {
        return { url: prediction.url };
      }
    }

    return { error: 'No image data found in response.' };

  } catch (error) {
    console.error('Gemini Generation Exception:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
