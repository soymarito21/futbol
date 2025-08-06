// script.js
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, db, collection, addDoc } from './firebase.js';

let players = [];
let currentUser = null;

const userInfo = document.getElementById('user-info');
const formSection = document.getElementById('form-section');
const btnLogin = document.getElementById('btnLogin');
const teamNameInput = document.getElementById('teamName');
const playerNameInput = document.getElementById('playerName');
const playerNationInput = document.getElementById('playerNation');
const playerPositionInput = document.getElementById('playerPosition');
const playerRatingInput = document.getElementById('playerRating');
const playerList = document.getElementById('playerList');
const btnAddPlayer = document.getElementById('btnAddPlayer');
const btnSaveTeam = document.getElementById('btnSaveTeam');

btnLogin.onclick = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
  } catch (e) {
    alert("Error al iniciar sesión: " + e.message);
  }
};

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    userInfo.innerHTML = `
      <p>👤 Hola, ${user.displayName}</p>
      <button id="btnLogout">Cerrar sesión</button>
    `;
    formSection.style.display = 'block';
    document.getElementById('btnLogout').onclick = () => signOut(auth);
  } else {
    currentUser = null;
    userInfo.innerHTML = `<button id="btnLogin">Iniciar sesión con Google</button>`;
    document.getElementById('btnLogin').onclick = btnLogin.onclick;
    formSection.style.display = 'none';
    players = [];
    renderPlayers();
  }
});

btnAddPlayer.onclick = () => {
  const name = playerNameInput.value.trim();
  const nation = playerNationInput.value.trim();
  const position = playerPositionInput.value.trim();
  const rating = parseInt(playerRatingInput.value);

  if (!name || !nation || !position || !rating || rating < 1 || rating > 100) {
    alert('Completa todos los campos correctamente.');
    return;
  }

  players.push({ name, nation, position, rating });
  renderPlayers();

  playerNameInput.value = '';
  playerNationInput.value = '';
  playerPositionInput.value = '';
  playerRatingInput.value = '';
};

function renderPlayers() {
  playerList.innerHTML = '';
  players.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'player-card';
    div.innerHTML = `
      <span>${p.name} | ${p.nation} | ${p.position} | ⭐ ${p.rating}</span>
      <button onclick="removePlayer(${i})">❌</button>
    `;
    playerList.appendChild(div);
  });
}

window.removePlayer = (index) => {
  players.splice(index, 1);
  renderPlayers();
};

btnSaveTeam.onclick = async () => {
  const teamName = teamNameInput.value.trim();
  if (!teamName) {
    alert('Pon un nombre al equipo.');
    return;
  }
  if (players.length === 0) {
    alert('Añade al menos un jugador.');
    return;
  }
  if (!currentUser) {
    alert('Inicia sesión para guardar el equipo.');
    return;
  }
  try {
    await addDoc(collection(db, "teams"), {
      userId: currentUser.uid,
      teamName,
      players,
      createdAt: new Date()
    });
    alert('Equipo guardado con éxito!');
    players = [];
    renderPlayers();
    teamNameInput.value = '';
  } catch (e) {
    alert('Error guardando equipo: ' + e.message);
  }
};

