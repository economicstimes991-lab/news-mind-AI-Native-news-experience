const BASE_URL = "http://localhost:5000";

const landingPage = document.getElementById("landing-page");
const dashboard = document.getElementById("dashboard");
const startBtn = document.getElementById("start-btn");

const interestButtons = document.querySelectorAll(".interest-btn");
const selectedInterestsDiv = document.getElementById("selected-interests");

const newsContainer = document.getElementById("news-container");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let selectedInterests = [];

/* ---------------- INTEREST SELECTION ---------------- */

interestButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.innerText;

    if (selectedInterests.includes(value)) {
      selectedInterests = selectedInterests.filter(i => i !== value);
      btn.classList.remove("active");
    } else {
      selectedInterests.push(value);
      btn.classList.add("active");
    }
  });
});

/* ---------------- START APP ---------------- */

startBtn.addEventListener("click", () => {
  if (selectedInterests.length === 0) {
    alert("Select at least one interest");
    return;
  }

  landingPage.classList.add("hidden");
  dashboard.classList.remove("hidden");

  selectedInterestsDiv.innerText = selectedInterests.join(", ");

  fetchNews();
});

/* ---------------- FETCH NEWS ---------------- */

async function fetchNews() {
  try {
    newsContainer.innerHTML = "<p>Loading news...</p>";

    const res = await fetch(`${BASE_URL}/getNews`);
    const data = await res.json();

    if (!data.articles) {
      newsContainer.innerHTML = "<p>No news found</p>";
      return;
    }

    renderNews(data.articles);
  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = "<p>Error loading news</p>";
  }
}

/* ---------------- RENDER NEWS ---------------- */

function renderNews(articles) {
  newsContainer.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card";

    const safeTitle = article.title.replace(/'/g, "");

    card.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <button onclick="askAI('${safeTitle}')">Explain</button>
    `;

    newsContainer.appendChild(card);
  });
}

/* ---------------- CHAT / AI ---------------- */

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  askAI(text);
}

async function askAI(query) {
  addMessage("User", query);

  try {
    const res = await fetch(`${BASE_URL}/askNews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    addMessage("AI", data.answer || "No response from AI");
  } catch (error) {
    console.error(error);
    addMessage("AI", "Error fetching response");
  }
}

/* ---------------- CHAT UI ---------------- */

function addMessage(role, text) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${role}:</strong> ${text}`;
  chatBox.appendChild(p);

  chatBox.scrollTop = chatBox.scrollHeight;
}
/* Firebase wala hai */
import { savePreferences, filterNews } from "./personalization.js";

// Example interests
const interests = ["technology", "finance"];

// Example usage
savePreferences("user1", interests);
/* Firebase wala kahatam*/ 
