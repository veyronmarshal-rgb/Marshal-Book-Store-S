import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { messages } = req.body;
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: "Tu es l'expert Libeer. Pose EXACTEMENT 3 questions courtes, une par une, pour recommander un pack : 'business', 'romance' ou 'curious'. Après la 3ème réponse, renvoie UNIQUEMENT un JSON : { \"packId\": \"id\", \"justification\": \"...\" }"
  });

  try {
    const chat = model.startChat({ history: messages.slice(0, -1) });
    const result = await chat.sendMessage(messages[messages.length - 1].parts[0].text);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
