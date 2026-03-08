function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export class LocalNet {
  uid;
  callback;

  constructor() {
  }

  async signIn() {
    let uid = "1";
    this.uid = uid;
    console.log(`Signed in with UID: ${this.uid}`);
  }

  async createRoom() {
    const code = generateRoomCode();
    return code;
  }

  async joinRoom(code) {
    let config = { winCondition: 5 }
    return { config, player: 2 };
  }

  onOpponentJoin(roomCode, callback) {

  }

  sendMove(roomCode, q, r, player) {
    console.log("sending move");
    this.callback({ q, r, player });
  }

  onMove(roomCode, callback) {
    console.log("setting callback");
    this.callback = callback;
  }
}

