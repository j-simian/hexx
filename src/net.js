const firebaseConfig = {
  apiKey: "AIzaSyA2hTySbERTlUag9qMF79sYxOzu5E569YE",
  authDomain: "hexx-96cd9.firebaseapp.com",
  databaseURL: "https://hexx-96cd9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hexx-96cd9",
  storageBucket: "hexx-96cd9.firebasestorage.app",
  messagingSenderId: "771952268121",
  appId: "1:771952268121:web:229e7946a62a07cd64b248",
  measurementId: "G-PGDEPGJJST"
};

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export class Net {
  app;
  db;
  uid;

  constructor() {
    this.app = firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();
  }

  async signIn() {
    const result = await firebase.auth().signInAnonymously();
    this.uid = result.user.uid;
    console.log(`Signed in with UID: ${this.uid}`);
  }

  async createRoom() {
    const code = generateRoomCode();
    await this.db.ref(`rooms/${code}`).set({
      config: { winCondition: 5 },
      players: { 1: this.uid },
    });
    return code;
  }

  async joinRoom(code) {
    const snapshot = await this.db.ref(`rooms/${code}`).once("value");
    const room = snapshot.val();
    if (!room) throw new Error("Room not found");

    if (room.players[1] === this.uid) {
      return { config: room.config, player: 1 };
    }

    if (room.players[2] === this.uid) {
      return { config: room.config, player: 2 };
    }

    if (room.players[2]) throw new Error("Room is full");
    await this.db.ref(`rooms/${code}/players/2`).set(this.uid);
    return { config: room.config, player: 2 };
  }

  onOpponentJoin(roomCode, callback) {
    this.db.ref(`rooms/${roomCode}/players/2`).on("value", (snapshot) => {
      if (snapshot.val()) callback(snapshot.val());
    });
  }

  sendMove(roomCode, q, r, player) {
    this.db.ref(`rooms/${roomCode}/moves`).push({ q, r, player });
  }

  onMove(roomCode, callback) {
    this.db.ref(`rooms/${roomCode}/moves`).on("child_added", (snapshot) => {
      let val = snapshot.val();
      console.log(val);
      callback(val);
    });
  }
}
