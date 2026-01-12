let currentQuestion = 0;
let scores = { business: 0, romance: 0, curious: 0 };

const PACKS_DATA = {
    business: { id: "business", name: "Business & Développement Personnel", price: "2 999", desc: "Boostez votre mentalité et vos finances.", icon: "🚀" },
    romance: { id: "romance", name: "Romance & Divertissement", price: "1 999", desc: "Évadez-vous avec des récits passionnants.", icon: "💖" },
    curious: { id: "curious", name: "Curieux Littéraire", price: "2 499", desc: "Élargissez votre culture générale.", icon: "🌍" }
};

const questions = [
    { q: "Qu'est-ce qui vous motive le plus ?", options: [{ text: "L'argent et le succès", target: "business" }, { text: "Le plaisir et l'évasion", target: "romance" }, { text: "Apprendre et découvrir", target: "curious" }] },
    { q: "Votre style de lecture ?", options: [{ text: "Pratique et efficace", target: "business" }, { text: "Émotif et captivant", target: "romance" }, { text: "Culturel et varié", target: "curious" }] },
    { q: "Votre but cette année ?", options: [{ text: "Devenir un leader", target: "business" }, { text: "Être plus épanoui", target: "romance" }, { text: "Être plus cultivé", target: "curious" }] }
];

function startQuiz() { currentQuestion = 0; scores = { business: 0, romance: 0, curious: 0 }; showQuestion(); }

function showQuestion() {
    const q = questions[currentQuestion];
    let optionsHtml = q.options.map((opt) => `<button onclick="handleAnswer('${opt.target}')" class="w-full text-left p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl mb-3 text-sm transition-all">${opt.text}</button>`).join('');
    document.getElementById('app').innerHTML = `<div class="space-y-6 animate-fadeIn"><h2 class="text-2xl font-bold">${q.q}</h2><div class="pt-2">${optionsHtml}</div></div>`;
}

function handleAnswer(target) { scores[target]++; currentQuestion++; if (currentQuestion < questions.length) { showQuestion(); } else { showResult(); } }

function showResult() {
    const winnerId = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const rec = PACKS_DATA[winnerId];
    let others = Object.values(PACKS_DATA).filter(p => p.id !== winnerId).map(p => `<div onclick="selectPack('${p.id}')" class="p-4 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer flex justify-between items-center"><span class="text-sm">${p.icon} ${p.name}</span><span class="text-xs font-bold text-amber-500">${p.price} F</span></div>`).join('');
    document.getElementById('app').innerHTML = `<div class="space-y-8 animate-fadeIn"><div class="bg-slate-800 p-6 rounded-2xl border-2 border-amber-500 shadow-2xl text-center"><h2 class="text-2xl font-bold text-amber-500">${rec.name}</h2><p class="text-slate-300 text-sm italic my-4 italic">"${rec.desc}"</p><div class="text-2xl font-bold mb-6">${rec.price} FCFA</div><button onclick="selectPack('${rec.id}')" class="w-full bg-amber-600 py-4 rounded-xl font-bold transition-all active:scale-95">Choisir ce pack</button></div><div class="space-y-3"><p class="text-center text-[10px] text-slate-500 uppercase font-bold">Ou choisissez une autre option</p>${others}</div></div>`;
}

function selectPack(id) {
    const p = PACKS_DATA[id];
    const monNumero = "22897599262"; // <<-- COLLE TES CHIFFRES ICI SANS ESPACES
    document.getElementById('app').innerHTML = `<div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6 animate-fadeIn"><h2 class="text-xl font-bold text-center">Paiement : ${p.name}</h2><div class="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center"><p class="text-sm">Envoyez <span class="font-bold text-white">${p.price} FCFA</span> au :</p><p class="text-2xl font-mono font-bold text-amber-500 my-2">${monNumero}</p><p class="text-[10px] text-slate-500 uppercase font-bold italic">Nom : VOTRE NOM ICI</p></div><div class="space-y-4"><input type="text" id="uName" class="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl outline-none" placeholder="Nom complet"><input type="email" id="uEmail" class="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl outline-none" placeholder="Email"><button onclick="send('${p.name}', '${p.price}', '${monNumero}')" class="w-full bg-emerald-600 py-4 rounded-xl font-bold">J'ai payé</button></div></div>`;
}

function send(pName, price, num) {
    const n = document.getElementById('uName').value;
    const e = document.getElementById('uEmail').value;
    if(!n || !e) return alert("Remplissez tout !");
    window.open(`https://wa.me/${num}?text=${encodeURIComponent("Bonjour Libeer ! Je suis " + n + ". J'ai payé " + price + " F pour le pack " + pName + ". Mon email : " + e)}`, '_blank');
}
