import {
  processNews,
  askNews,
  generateHeadline,
  quickSummary
} from "./llm.js";
import readline from "readline";

// Example Article
const article = `
Iran War News: Kuwait says Iranian drones, missiles hit port in northwestern gulf
Iranian drones and cruise missiles struck a port in the northwestern Gulf, Kuwait’s Ministry of Public Works said in a statement on Friday.

The ministry said the attack caused damage but no casualties.

“Emergency procedures in place for such cases have been activated in coordination with the relevant authorities,” it said.
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatLoop() {
  rl.question("\nAsk a question about the news (type 'exit' to quit): ", async (q) => {
    if (q.toLowerCase() === "exit") {
      console.log("Bye 👋");
      rl.close();
      return;
    }

    try {
      const ans = await askNews(q, article);
      console.log("\n--- Answer ---");
      console.log(ans);
    } catch (err) {
      console.log("\nError answering question. The model might be loading.");
    }

    chatLoop(); // Recursive call for continuous chat
  });
}

async function run() {
  console.log("------------------------------------------");
  console.log("🚀 NewsMind AI: Processing Article...");
  console.log("------------------------------------------");

  // 1. Full Analysis
  const data = await processNews(article);
  console.log("\n[1] Detailed Analysis:");
  console.table(data); // Using console.table makes JSON look great in terminal

  // 2. Headline
  console.log("\n[2] Suggested Headline:");
  const headline = await generateHeadline(article);
  console.log(`> ${headline}`);

  // 3. One-sentence Summary
  console.log("\n[3] Quick Summary:");
  const summary = await quickSummary(article);
  console.log(`> ${summary}`);

  // 4. Start Chat
  console.log("\n------------------------------------------");
  console.log("💬 Chat with this Article");
  chatLoop();
}

// Global error handling for the initial run
run().catch(err => {
  console.error("Fatal Error during initialization:", err);
  process.exit(1);
});