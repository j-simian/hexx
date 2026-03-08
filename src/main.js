import { Renderer } from "./render.js";
import { InputHandler } from "./input.js";
import { Net } from "./net.js";

const net = new Net();
let renderer;
let inputHandler;

function showState(state) {
  for (const el of document.querySelectorAll("[data-state]")) {
    el.hidden = el.dataset.state !== state;
  }
}

function setOpponentStatus(connected, code = null) {
  const el = document.getElementById("opponent-status");
  if (connected) {
    el.innerHTML = "Opponent connected";
  } else {
    document.getElementById("join-code-preview").innerHTML = code;
    document.getElementById("copy-join-link").addEventListener("click", () => {
      const url = `${location.origin}${location.pathname}?room=${code}`;
      navigator.clipboard.writeText(url);
      document.getElementById("copy-join-link").innerHTML = "Copied!";
    });
  }
}

function startGame() {
  showState("game");
  const debug = new URLSearchParams(location.search).get("debug");
  const canvas = document.getElementById("canvas");
  renderer = new Renderer(30, "#bdb5a6", canvas);
  inputHandler = new InputHandler(renderer.camera);
  window.addEventListener("resize", () => renderer.handleResize(canvas));
  inputHandler.registerHandlers(canvas);
  let uiState = { debug, hovered: null };

  function loop() {
    renderer.clear();
    uiState.hovered = inputHandler.hovered;
    renderer.renderGrid(uiState);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

async function initLobby() {
  await net.signIn();

  const room = new URLSearchParams(location.search).get("room");
  if (room) document.getElementById("join-code").value = room;

  document.getElementById("btn-create").addEventListener("click", async () => {
    const code = await net.createRoom();
    startGame();
    setOpponentStatus(false, code);
    net.onOpponentJoin(code, () => setOpponentStatus(true));
  });

  document.getElementById("btn-join").addEventListener("click", async () => {
    const code = document.getElementById("join-code").value;
    const { config, player } = await net.joinRoom(code);
    startGame();
    setOpponentStatus(true);
  });
}

showState("lobby");
initLobby();
