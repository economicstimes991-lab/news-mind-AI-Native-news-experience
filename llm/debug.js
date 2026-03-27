import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function runAudit() {
  console.log("--- 🕵️ NewsMind AI: Parameter Audit ---");

  // 1. Check Environment Variables
  const key = process.env.HF_API_KEY;
  if (!key) {
    console.error("❌ ERROR: HF_API_KEY is missing from .env");
    return;
  }
  console.log(`✅ .env Loaded: Key starts with "${key.substring(0, 7)}..."`);

  // 2. Check Token Permissions & Identity
  try {
    const authRes = await axios.get("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${key}` }
    });
    console.log(`✅ Token Valid: Authenticated as "${authRes.data.name}"`);
    
    // Note: Manual check needed in HF Settings for "Inference Providers" scope
    console.log(`💡 Note: Ensure your token has 'Inference Providers' scope in HF Settings.`);
  } catch (err) {
    console.error("❌ ERROR: Token is invalid or expired.", err.response?.data || err.message);
    return;
  }

  // 3. Check Model Availability on the Router
  // We'll test Llama 3.1 8B as it's the most common stable model in 2026
  const testModel = "meta-llama/Llama-3.1-8B-Instruct";
  console.log(`\n--- 🤖 Testing Model: ${testModel} ---`);

  try {
    const routerRes = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: testModel,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
        provider: "hf-inference" // Forces the serverless fleet check
      },
      { headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" } }
    );

    if (routerRes.data.choices) {
      console.log("✅ Router Connection: SUCCESS");
      console.log(`💬 Model Response: "${routerRes.data.choices[0].message.content}"`);
    }
  } catch (err) {
    const data = err.response?.data;
    console.error("❌ ERROR: Router call failed.");
    
    if (data?.error?.includes("no longer supported")) {
      console.log("👉 Advice: The endpoint is correct, but the model ID might need a provider suffix.");
    } else if (err.response?.status === 404) {
      console.log("👉 Advice: 404 usually means the model isn't deployed by ANY provider. Try 'mistralai/Mistral-7B-Instruct-v0.3'");
    } else {
      console.log("Full Error Report:", JSON.stringify(data, null, 2));
    }
  }
}

runAudit();