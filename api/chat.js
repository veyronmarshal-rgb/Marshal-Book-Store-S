import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Tu es l'expert Libeer. Ton but est de recommander un pack de livres numériques parmi : 'business', 'romance' ou 'curious'. Pose EXACTEMENT 3 questions courtes, une par une. Après la 3ème réponse de l'utilisateur, analyse ses goûts et renvoie UNIQUEMENT un objet JSON comme ceci : { \"packId\": \"id_du_pack\", \"justification\": \"ta raison courte\" }. Ne dis rien d'autre que le JSON à la fin."
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.parts[0].text }]
      }))
    });

    const result = await chat.sendMessage(messages[messages.length - 1].parts[0].text);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération" });
  }
}
