import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "https://router.huggingface.co/v1/chat/completions";

const MODELS = [
  "meta-llama/Llama-3.1-8B-Instruct", 
  "mistralai/Mistral-7B-Instruct-v0.3", 
  "microsoft/Phi-3-mini-4k-instruct"
];

const headers = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
  "Content-Type": "application/json"
};

function extractJSON(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }
    return { raw: text };
  } catch (e) {
    return { error: "Parse Error", raw: text };
  }
}

async function callLLM(messages) {
  for (const modelId of MODELS) {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: modelId,
          messages: messages,
          max_tokens: 800, // ⬆️ Increased to allow for full paragraphs
          temperature: 0.6, // ⬆️ Slightly higher for better prose flow
        },
        { headers, timeout: 15000 } 
      );

      return response.data.choices[0].message.content.trim();

    } catch (error) {
      console.warn(`⚠️ Model ${modelId} failed. Trying next...`);
      if (modelId === MODELS[MODELS.length - 1]) {
        return "Error: All AI models are currently unavailable.";
      }
    }
  }
}

/**
 * 🧠 Refined News Processing
 * Forces the model to act as a domain expert and provide paragraph-form data.
 */
export async function processNews(article) {
  const systemPrompt = `You are a Senior News & Intelligence Analyst. 
  Your task is to provide a deep-dive analysis in JSON format.
  
  REQUIRED JSON STRUCTURE:
  {
    "summary": "A comprehensive 3-4 sentence paragraph summarizing the core events, key actors, and immediate outcomes.",
    "explanation": "A detailed technical or contextual paragraph explaining the background, the 'why' behind the event, and any relevant historical or political friction.",
    "importance": "A domain-specific impact analysis explaining the long-term strategic, economic, or geopolitical consequences of this event."
  }

  STRICT RULES:
  - Do NOT use one-word labels like 'Medium' or 'High' for importance. Explain the weight of the event.
  - Return ONLY valid JSON. 
  - Use professional, objective language.`;

  const output = await callLLM([
    { role: "system", content: systemPrompt },
    { role: "user", content: `Analyze the following news article in depth: ${article}` }
  ]);
  
  return extractJSON(output);
}

export async function askNews(question, article) {
  return await callLLM([
    { role: "system", content: "You are a helpful assistant. Answer the user's question concisely based on the provided context." },
    { role: "user", content: `Context: ${article}\nQuestion: ${question}` }
  ]);
}

export async function generateHeadline(article) {
  return await callLLM([
    { role: "system", content: "Create a professional and punchy news headline." },
    { role: "user", content: article }
  ]);
}

export async function quickSummary(article) {
  return await callLLM([
    { role: "system", content: "Summarize the event in one clear, impactful sentence." },
    { role: "user", content: article }
  ]);
}