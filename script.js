let messages = [];

const reviews = [
    { name: 'Amadou S.', comment: 'Sélection incroyable, le pack Business m\'a ouvert les yeux.', rating: 5 },
    { name: 'Fatou K.', comment: 'Reçu sur WhatsApp rapidement. Service au top !', rating: 5 },
    { name: 'Jean M.', comment: 'L\'IA a vraiment bien ciblé mes goûts.', rating: 4 },
    { name: 'Moussa T.', comment: 'Excellent rapport qualité/prix pour 2000 FCFA.', rating: 5 },
    { name: 'Aminata Z.', comment: 'Le service client est très réactif.', rating: 5 }
];

function displayReviews() {
    const container = document.getElementById('reviews-container');
    if(container) {
        container.innerHTML = reviews.map(rev => `
            <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-sm text-amber-500">${rev.name}</span>
                    <span class="text-xs text-yellow-500">${'★'.repeat(rev.rating)}</span>
                </div>
                <p class="text-xs text-slate-400 italic">"${rev.comment}"</p>
            </div>
        `).join('');
    }
}

async function startQuiz() {
    document.getElementById('app').innerHTML = `<div class="p-8 text-center animate-pulse text-amber-500">L'IA prépare vos questions...</div>`;
    askQuestion("Bonjour ! Je souhaite trouver un pack de livres.");
}

async function askQuestion(userInput) {
    messages.push({ role: "user", parts: [{ text: userInput }] });
    
    // Affichage d'un loader pendant l'attente
    const app = document.getElementById('app');
    const oldContent = app.innerHTML;
    app.innerHTML = `<div class="p-8 text-center animate-pulse text-amber-500">Analyse en cours...</div>`;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });
        
        const data = await response.json();
        messages.push({ role: "model", parts: [{ text: data.text }] });

        if (data.text.includes('{')) {
            const cleanJson = data.text.substring(data.text.indexOf('{'), data.text.lastIndexOf('}') + 1);
            showRecommendation(JSON.parse(cleanJson));
        } else {
            renderQuestion(data.text);
        }
    } catch (e) {
        app.innerHTML = `<div class="p-4 bg-red-500/20 text-red-400 rounded-xl">Erreur de connexion. Vérifiez votre clé API.</div>`;
    }
}

function renderQuestion(text) {
    document.getElementById('app').innerHTML = `
        <div class="space-y-6 animate-fadeIn">
            <div class="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl text-lg">${text}</div>
            <input type="text" id="answer" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 focus:border-amber-500 outline-none" placeholder="Écrivez ici...">
            <button onclick="askQuestion(document.getElementById('answer').value)" class="w-full bg-amber-600 py-4 rounded-xl font-bold shadow-lg">Continuer</button>
        </div>
    `;
}

function showRecommendation(rec) {
    const packs = {
        business: { name: "Développement & Business", desc: "Boostez votre carrière et vos finances." },
        romance: { name: "Romance & Émotions", desc: "Évadez-vous avec des récits passionnants." },
        curious: { name: "Culture & Curiosité", desc: "Élargissez votre culture générale." }
    };
    const pack = packs[rec.packId] || packs.curious;

    document.getElementById('app').innerHTML = `
        <div class="bg-slate-800 p-6 rounded-2xl border-2 border-amber-500 space-y-6 shadow-2xl">
            <h2 class="text-2xl font-bold text-amber-500">${pack.name}</h2>
            <p class="text-slate-300 italic">"${rec.justification}"</p>
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
                <p class="text-sm font-bold text-slate-400 uppercase tracking-tighter">Instructions de paiement</p>
                <p class="text-xs">Envoyez 2000 FCFA par T-Money ou Flooz :</p>
                <p class="text-2xl font-mono font-bold text-white tracking-widest">+228 97 59 92 62</p>
                <p class="text-sm text-amber-500 font-semibold">Nom: KASSANDOU Essonani</p>
            </div>
            <button onclick="showFinalForm()" class="w-full bg-emerald-600 py-4 rounded-xl font-bold shadow-lg">J'ai envoyé les 2000 FCFA</button>
        </div>
    `;
}

function showFinalForm() {
    document.getElementById('app').innerHTML = `
        <div class="space-y-6">
            <div class="text-center"><h2 class="text-2xl font-bold">Dernière étape !</h2><p class="text-slate-400">Où devons-nous envoyer vos livres ?</p></div>
            <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
                <input type="text" id="name" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 outline-none" placeholder="Nom complet">
                <input type="email" id="email" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 outline-none" placeholder="Adresse Email">
                <input type="tel" id="whatsapp" class="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 outline-none" placeholder="Numéro WhatsApp">
                <button onclick="confirmOrder()" class="w-full bg-amber-600 py-4 rounded-xl font-bold">Confirmer et recevoir</button>
            </div>
        </div>
    `;
}

function confirmOrder() {
    const wa = document.getElementById('whatsapp').value;
    const name = document.getElementById('name').value;
    const msg = encodeURIComponent(`Bonjour ! Je suis ${name}. J'ai payé mon pack Libeer. Voici mon numéro de transfert...`);
    window.open(`https://wa.me/228XXXXXXXX?text=${msg}`, '_blank');
    alert("C'est parfait ! On se retrouve sur WhatsApp pour la livraison.");
}

// Lancement initial
displayReviews();


