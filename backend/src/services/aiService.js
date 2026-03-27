const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeArticle(article) {
  const prompt = `Summarize this news in 3 bullet points:\n\n${article.title}\n${article.description}\n${article.content}`;
  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  return completion.choices[0].message.content.trim();
}