const teamA = [];
const teamB = [];

function addPlayer(team) {
  const name = prompt("Nombre del jugador:");
  const rating = parseInt(prompt("Valoración (0–100):"));
  const nationality = prompt("Nacionalidad:");

  const player = { name, rating, nationality };
  if (team === 'A') {
    teamA.push(player);
    renderTeam('A');
  } else {
    teamB.push(player);
    renderTeam('B');
  }
}

function renderTeam(team) {
  const container = document.getElementById(`team${team}`);
  const players = team === 'A' ? teamA : teamB;
  container.innerHTML = players.map(p => `${p.name} (${p.rating}) - ${p.nationality}`).join('<br>');
}

function simulateMatch() {
  if (teamA.length < 1 || teamB.length < 1) {
    alert("Ambos equipos deben tener al menos 1 jugador.");
    return;
  }

  const avgA = teamA.reduce((sum, p) => sum + p.rating, 0) / teamA.length;
  const avgB = teamB.reduce((sum, p) => sum + p.rating, 0) / teamB.length;

  let resultText = `Promedio A: ${avgA.toFixed(1)} vs Promedio B: ${avgB.toFixed(1)}<br>`;
  if (avgA > avgB) resultText += "🏆 ¡Gana el Equipo A!";
  else if (avgB > avgA) resultText += "🏆 ¡Gana el Equipo B!";
  else resultText += "🤝 ¡Empate!";

  document.getElementById("result").innerHTML = resultText;
}
