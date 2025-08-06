function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      // También crea o actualiza el perfil del usuario en Firestore
      db.collection('users').doc(user.uid).set({
        displayName: user.displayName,
        email: user.email
      }, { merge: true });
      loadUserTeams();
    });
}
function saveTeam() {
  const user = auth.currentUser;
  if (!user) return alert("Inicia sesión primero.");

  const team = { name: teamName, players };
  db.collection('users').doc(user.uid)
    .collection('teams')
    .add(team)
    .then(() => alert("Equipo guardado en la nube ✅"));
}
function loadUserTeams() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection('users').doc(user.uid)
    .collection('teams')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => renderTeamCard(doc.id, doc.data()));
    });
}
match /users/{userId}/teams/{teamId} {
  allow read, write: if request.auth.uid == userId;
}
