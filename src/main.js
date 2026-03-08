import { Renderer } from "./render.js";
import { InputHandler } from "./input.js";
import { Net } from "./net.js";
import { Game } from "./game.js";

const net = new Net();

let myPlayer;
let roomCode;

function showState(state) {
  for (const el of document.querySelectorAll("[data-state]")) {
    el.hidden = el.dataset.state !== state;
  }
}

function setOpponentStatus(connected, roomCode = null) {
  const el = document.getElementById("opponent-status");
  if (connected) {
    el.innerHTML = "Opponent connected";
  } else {
    document.getElementById("join-code-preview").innerHTML = roomCode;
    document.getElementById("copy-join-link").addEventListener("click", () => {
      const url = `${location.origin}${location.pathname}?room=${roomCode}`;
      navigator.clipboard.writeText(url);
      document.getElementById("copy-join-link").innerHTML = "Copied!";
    });
  }
}

function onPlaceStone(q, r, numMovesRemaining) {
  let moves = numMovesRemaining == 1 ? "move" : "moves";
  document.getElementById("moves-remaining").innerHTML = `${numMovesRemaining} ${moves} remaining`;
}

function setCurrentPlayer(_turnIndex, currentPlayer) {
  document.getElementById("turn-indicator").innerHTML = currentPlayer == myPlayer ? `Your turn 🔴` : `Their turn`;
}

function sendPlaceStone(q, r, player) {
  if (player != this.myPlayer) {
    console.log("wrong player?");
    return;
  }
  net.sendMove(roomCode, q, r, myPlayer);
}

function onGameOver(winner) {
  const msg = winner === myPlayer ? "You win!" : "You lose!";
  document.getElementById("opponent-status").innerHTML = msg;
  document.getElementById("game-over-text").innerHTML = msg;
  document.getElementById("game-over-modal").hidden = false;
}

function startGame() {
  const debug = new URLSearchParams(location.search).get("debug");

  showState("game");
  const canvas = document.getElementById("canvas");

  let renderer = new Renderer(30, "#bdb5a6", canvas);
  let game = new Game(myPlayer, onPlaceStone, setCurrentPlayer, sendPlaceStone, onGameOver);

  let onHexClick = (q, r) => game.tryPlaceStone(q, r);
  let inputHandler = new InputHandler(renderer.camera, renderer.radius, onHexClick);

  net.onMove(roomCode, ({ q, r, player }) => {
    game.placeStone(q, r, player);
  });

  let uiState = { debug, hovered: null };
  inputHandler.registerHandlers(canvas);

  function loop() {
    renderer.clear();
    uiState.hovered = inputHandler.hovered;
    renderer.renderGrid(uiState, game.moves);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

async function initLobby() {
  await net.signIn();

  const room = new URLSearchParams(location.search).get("room");
  if (room) document.getElementById("join-code").value = room;

  document.getElementById("btn-create").addEventListener("click", async () => {
    roomCode = await net.createRoom();
    myPlayer = 1;
    startGame();
    setOpponentStatus(false, roomCode);
    net.onOpponentJoin(roomCode, () => setOpponentStatus(true));
  });

  document.getElementById("btn-join").addEventListener("click", async () => {
    roomCode = document.getElementById("join-code").value;
    const { config, player } = await net.joinRoom(roomCode);
    myPlayer = player;
    startGame();
    setOpponentStatus(true);
  });
}

showState("lobby");
initLobby();
