function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export class Net {
  uid;

  constructor() {
  }

  async signIn() {
    let uid = "111111-abcdef-fake-uuid";
    this.uid = uid;
    console.log(`Signed in with UID: ${this.uid}`);
  }

  async createRoom() {
    const code = generateRoomCode();
    return code;
  }

  async joinRoom(code) {
    let room;
    room = { config: { winCondition: 5 }, players: { 1: "111111-abcdef-fake-uuid" } }
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

