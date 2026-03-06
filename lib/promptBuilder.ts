import { GoogleGenAI, Type } from '@google/genai';

export interface BookConfig {
  title: string;
  theme: string;
  audience: string;
  style: string;
  numPages: number;
  trimSize: string;
  margins: number;
  blankBacksides: boolean;
  pageNumbers: boolean;
}

export interface BookMetadata {
  description: string;
  keywords: string[];
  categories: string[];
  marketingSummary: string;
}

export interface PagePrompt {
  id: string;
  pageNumber: number;
  prompt: string;
  subject: string;
}

export async function generateMetadata(config: BookConfig): Promise<BookMetadata> {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
  
  const systemInstruction = `You are an expert Amazon KDP publisher and copywriter.
Your task is to generate listing metadata for a coloring book titled "${config.title}", themed around "${config.theme}", aimed at ${config.audience}, with a "${config.style}" art style.

Rules:
- Description must be persuasive, plain text with line breaks (no HTML).
- Provide exactly 7 long-tail keywords optimized for Amazon search.
- Provide 3 relevant Amazon KDP categories.
- Provide a short, catchy marketing summary for social media.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate the KDP metadata for this coloring book.`,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: 'Persuasive Amazon description in plain text with line breaks',
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Exactly 7 long-tail keywords',
          },
          categories: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3 relevant Amazon KDP categories',
          },
          marketingSummary: {
            type: Type.STRING,
            description: 'Short catchy summary for social media',
          },
        },
        required: ['description', 'keywords', 'categories', 'marketingSummary'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate metadata');

  try {
    return JSON.parse(text) as BookMetadata;
  } catch (e) {
    console.error('Failed to parse metadata JSON', e);
    throw new Error('Invalid metadata format returned from AI');
  }
}

export async function generatePrompts(config: BookConfig): Promise<PagePrompt[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
  
  const systemInstruction = `You are an expert coloring book designer. 
Your task is to generate a list of subjects and detailed image generation prompts for a coloring book.
The coloring book is titled "${config.title}", themed around "${config.theme}", aimed at ${config.audience}, and uses a "${config.style}" art style.
Generate exactly ${config.numPages} unique subjects and prompts.

Rules for prompts:
- Must specify "black and white line art only"
- Must specify "thick clean outlines"
- Must specify "no shading, no grayscale, pure white background"
- Must specify "centered composition, coloring-book appropriate"
- Ensure style consistency across all prompts.
- The prompt should describe the visual content clearly.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${config.numPages} prompts for the coloring book.`,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: 'A short title or subject for the page (e.g., "Cute Lion")',
            },
            prompt: {
              type: Type.STRING,
              description: 'The detailed image generation prompt following the rules.',
            },
          },
          required: ['subject', 'prompt'],
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate prompts');

  try {
    const parsed = JSON.parse(text);
    return parsed.map((item: any, index: number) => ({
      id: crypto.randomUUID(),
      pageNumber: index + 1,
      subject: item.subject,
      prompt: item.prompt,
    }));
  } catch (e) {
    console.error('Failed to parse prompts JSON', e);
    throw new Error('Invalid prompt format returned from AI');
  }
}
