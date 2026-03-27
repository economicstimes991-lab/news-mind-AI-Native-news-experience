import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Save user interests
export async function savePreferences(userId, interests) {
  await addDoc(collection(db, "users"), {
    userId: userId,
    interests: interests,
  });
}

// Get user interests
export async function getPreferences() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => doc.data());
}

// Filter news
export function filterNews(news, interests) {
  return news.filter(article =>
    interests.some(interest =>
      article.title.toLowerCase().includes(interest.toLowerCase())
    )
  );
}
