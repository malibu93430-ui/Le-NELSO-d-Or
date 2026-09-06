const API_URL = "https://script.google.com/macros/s/AKfycbwqn313sKP6NIa4plrwoji80VXttBtNy2gI0o3FS75fDa1j5NOJuYE-AuMrEqLLASFg/exec";

let globalBareme = [];

document.addEventListener("DOMContentLoaded", function () {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const pageId = e.target.getAttribute('data-page');
      
      document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
      document.querySelectorAll('.nav-btn').forEach(function (b) { b.classList.remove('active'); });
      
      document.getElementById('page-' + pageId).classList.add('active');
      e.target.classList.add('active');
    });
  });

  loadData();
});

async function loadData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    globalBareme = data.bareme;
    
    displayLeader(data.participants[0]);
    displayRanking(data.participants);
    populateForm(data.participants, data.bareme);
    displayRules(data.bareme);
  } catch (err) {
    console.error("Erreur de chargement :", err);
  }
}

function displayLeader(leader) {
  if (!leader) return;
  document.getElementById("leader-name").textContent = leader.nom;
  document.getElementById("leader-score").textContent = leader.score;
  document.getElementById("leader-incidents").textContent = leader.incidents + " incident(s)";
}

function displayRanking(participants) {
  const list = document.getElementById("ranking-list");
  list.innerHTML = "";
  participants.forEach(function (p) {
    const li = document.createElement("li");
    li.innerHTML = "<strong>" + p.nom + "</strong> <span>" + p.score + " pts (" + p.incidents + " inc.)</span>";
    list.appendChild(li);
  });
}

function displayRules(bareme) {
  const list = document.getElementById("rules-list");
  list.innerHTML = "";
  bareme.forEach(function (b) {
    const li = document.createElement("li");
    li.innerHTML = "<span>" + b.action + "</span> <strong>+" + b.points + " pt(s)</strong>";
    list.appendChild(li);
  });
}

function populateForm(participants, bareme) {
  const selectPart = document.getElementById("select-participant");
  const selectAct = document.getElementById("select-action");
  
  selectPart.innerHTML = "";
  selectAct.innerHTML = "";

  participants.forEach(function (p) {
    const opt = document.createElement("option");
    opt.value = p.nom;
    opt.textContent = p.nom;
    selectPart.appendChild(opt);
  });

  bareme.forEach(function (b) {
    const opt = document.createElement("option");
    opt.value = b.action;
    opt.textContent = b.action + " (+" + b.points + " pts)";
    selectAct.appendChild(opt);
  });
}

document.getElementById("incident-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const btn = document.getElementById("btn-submit");
  btn.disabled = true;
  btn.textContent = "Enregistrement...";

  const participant = document.getElementById("select-participant").value;
  const actionName = document.getElementById("select-action").value;
  const contexte = document.getElementById("input-contexte").value;
  const actionObj = globalBareme.find(function (b) { return b.action === actionName; });

  const payload = {
    participant: participant,
    action: actionName,
    points: actionObj ? actionObj.points : 0,
    contexte: contexte
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    
   // Soumission du formulaire de craquage
document.getElementById("incident-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const btn = document.getElementById("btn-submit");
  btn.disabled = true;
  btn.textContent = "Enregistrement...";

  const participant = document.getElementById("select-participant").value;
  const actionName = document.getElementById("select-action").value;
  const contexte = document.getElementById("input-contexte").value;
  const actionObj = globalBareme.find(function (b) { return b.action === actionName; });

  const payload = {
    participant: participant,
    action: actionName,
    points: actionObj ? actionObj.points : 0,
    contexte: contexte
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors", // Évite les blocages de sécurité CORS sur mobile/Safari
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload)
    });
    
    document.getElementById("input-contexte").value = "";
    
    // Petite pause de 1 seconde pour laisser le temps à Google Sheet d'écrire la ligne
    setTimeout(async () => {
      await loadData();
      document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
      document.querySelectorAll('.nav-btn').forEach(function (b) { b.classList.remove('active'); });
      document.getElementById('page-home').classList.add('active');
      document.querySelector('[data-page="home"]').classList.add('active');
      btn.disabled = false;
      btn.textContent = "Valider l'incident";
    }, 1000);

  } catch (err) {
    console.error("Erreur lors de l'envoi :", err);
    btn.disabled = false;
    btn.textContent = "Valider l'incident";
  }
});
