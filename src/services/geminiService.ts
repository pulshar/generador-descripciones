import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedDescription, LanguageCode, LengthOption } from "../types";

export const generateDescriptions = async (
  imageBase64: string,
  languages: LanguageCode[],
  length: LengthOption
): Promise<GeneratedDescription[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  // Clean the base64 string if it contains the data URL prefix
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `
    Analyze the provided image of a product.
    Act as an expert e-commerce copywriter.
    
    Task: Write a product title and a product description for this item in the following languages: ${languages.join(', ')}.
    
    Style/Length constraint: ${length} (Short means ~1 sentence, Medium means ~2-3 sentences, Long means ~4-5 sentences with detailed benefits).
    
    Ensure the tone is professional yet engaging, suitable for a modern e-commerce store.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              language: {
                type: Type.STRING,
                description: "The language of the description (e.g., Spanish, English)"
              },
              title: {
                type: Type.STRING,
                description: "A catchy product title"
              },
              description: {
                type: Type.STRING,
                description: "The product description text"
              }
            },
            required: ["language", "title", "description"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedDescription[];
    }
    
    throw new Error("No response generated");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Error generating descriptions. Please try again.");
  }
};