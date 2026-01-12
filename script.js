let step = 0;
const messages = [];

async function startQuiz() {
    document.getElementById('app').innerHTML = `<div class="p-4 bg-slate-800 rounded-xl">Chargement de l'IA...</div>`;
    askQuestion("Bonjour ! Je veux trouver mon pack de livres.");
}

async function askQuestion(userInput) {
    messages.push({ role: "user", parts: [{ text: userInput }] });

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
    });

    const data = await response.json();
    messages.push({ role: "model", parts: [{ text: data.text }] });

    // Si l'IA renvoie le JSON final
    if (data.text.includes('{')) {
        showRecommendation(JSON.parse(data.text));
    } else {
        renderQuestion(data.text);
    }
}

function renderQuestion(text) {
    document.getElementById('app').innerHTML = `
        <div class="space-y-4">
            <div class="p-4 bg-slate-800 rounded-xl border border-slate-700">${text}</div>
            <input type="text" id="answer" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700" placeholder="Ta réponse...">
            <button onclick="askQuestion(document.getElementById('answer').value)" class="w-full bg-amber-600 py-4 rounded-xl font-bold">Continuer</button>
        </div>
    `;
}

function showRecommendation(rec) {
    // On affiche le pack selon l'ID reçu (business, romance, curious)
    const packs = {
        business: { name: "Business & Mentalité", price: "2000 FCFA" },
        romance: { name: "Évasion & Romance", price: "2000 FCFA" },
        curious: { name: "Culture & Curiosité", price: "2000 FCFA" }
    };
    const pack = packs[rec.packId];

    document.getElementById('app').innerHTML = `
        <div class="bg-slate-800 p-6 rounded-2xl border border-amber-500/30 space-y-4">
            <h2 class="text-2xl font-bold text-amber-500">${pack.name}</h2>
            <p class="text-slate-300">${rec.justification}</p>
            <div class="border-t border-slate-700 pt-4">
                <p class="text-sm font-bold">Paiement Mobile Money (T-Money/Flooz)</p>
                <p class="text-2xl font-mono text-white mt-2">+225 01 02 03 04 05</p>
                <p class="text-xs text-slate-400">Nom : Jean-Luc Kouassi</p>
            </div>
            <button onclick="showFinalForm()" class="w-full bg-emerald-600 py-4 rounded-xl font-bold">J'ai payé 2000 FCFA</button>
        </div>
    `;
}

function showFinalForm() {
    document.getElementById('app').innerHTML = `
        <div class="space-y-4">
            <h2 class="text-xl font-bold">Où envoyer ton pack ?</h2>
            <input type="text" id="name" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700" placeholder="Ton nom complet">
            <input type="email" id="email" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700" placeholder="Ton email">
            <input type="tel" id="whatsapp" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700" placeholder="Numéro WhatsApp">
            <button onclick="confirmOrder()" class="w-full bg-amber-600 py-4 rounded-xl font-bold">Confirmer et recevoir</button>
        </div>
    `;
}

function confirmOrder() {
    const wa = document.getElementById('whatsapp').value;
    const msg = encodeURIComponent("Bonjour ! J'ai payé mon pack Libeer. Voici mes infos...");
    window.open(`https://wa.me/2250102030405?text=${msg}`, '_blank');
    alert("Merci ! Ton pack arrive par email. Contacte-nous sur WhatsApp pour accélérer l'envoi.");
}