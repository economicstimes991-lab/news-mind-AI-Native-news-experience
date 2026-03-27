import express from "express";
import cors from "cors";
import {
  processNews,
  askNews
} from "./llm.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Analyze News
app.post("/analyze", async (req, res) => {
  const { article } = req.body;

  const result = await processNews(article);
  res.json(result);
});

// 💬 Ask News
app.post("/ask", async (req, res) => {
  const { question, article } = req.body;

  const answer = await askNews(question, article);
  res.json({ answer });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});