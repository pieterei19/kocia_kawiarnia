import { fetchState, saveState as apiSaveState } from "./api.js";
import { createGlaskanieScene } from "./stage-glaskanie.js";
import { createPokojScene } from "./stage-pokoj.js";

const CATS = [
  { id: "milus", name: "Lucjan", emoji: "🐈‍⬛", cost: 0 },
  { id: "czarny", name: "Sadza", emoji: "🐈‍⬛", cost: 40 },
  { id: "biały", name: "Śnieżek", emoji: "🐈", cost: 80 },
  { id: "tygrys", name: "Tygrysek", emoji: "🐅", cost: 150 },
  { id: "lew", name: "Leon", emoji: "🦁", cost: 220 },
  { id: "panda", name: "Bambusek", emoji: "🐼", cost: 300 },
  { id: "koala", name: "Koalek", emoji: "🐨", cost: 380 },
  { id: "lis", name: "Lisek", emoji: "🦊", cost: 460 },
];

const DECOS = [
  { id: "kulka", name: "kulka wełny", emoji: "🧶", cost: 20 },
  { id: "miska", name: "miska", emoji: "🥣", cost: 25 },
  { id: "poduszka", name: "poduszka", emoji: "🛏️", cost: 60 },
  { id: "roślinka", name: "roślinka", emoji: "🪴", cost: 45 },
  { id: "pudełko", name: "pudełko", emoji: "📦", cost: 35 },
  { id: "ryba", name: "rybka", emoji: "🐟", cost: 30 },
];

const MINI_DAILY_LIMIT = 5;
const MINI_COST = 5;
const MINI_WIN_CHANCE = 0.3;
const MINI_MULT = 3;
const MINI_SYMBOLS = ["🐾", "🐟", "🧶", "🎀", "🐾"];

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

export async function startGame({ onLogout }) {
  let state = await fetchState();
  const today = todayStr();
  if (state.mini_last_day !== today) {
    state.mini_last_day = today;
    state.mini_today = 0;
  }

  let saveTimer = null;
  let dirty = false;
  function scheduleSave(immediate = false) {
    dirty = true;
    if (immediate) {
      flush();
      return;
    }
    if (saveTimer) return;
    saveTimer = setTimeout(flush, 1500);
  }
  function flush() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (!dirty) return;
    dirty = false;
    apiSaveState(state).catch(() => {
      dirty = true; // retry on next flush
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("beforeunload", flush);

  /* --- tabs --- */
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document.getElementById("panel-" + t.dataset.tab).classList.add("active");
      if (t.dataset.tab === "pokoj") {
        pokojScene.resize();
        renderRoom();
      } else if (t.dataset.tab === "glaskanie") {
        glaskanieScene.resize();
      }
    });
  });

  /* --- sceny 2D --- */
  const glaskanieScene = createGlaskanieScene(document.getElementById("catVisual"));
  const pokojScene = createPokojScene(document.getElementById("room"));

  function renderAll() {
    document.getElementById("heartsNum").textContent = Math.floor(state.hearts);
    document.getElementById("catsOwnedNum").textContent = state.owned_cats.length;

    const cat = CATS.find((c) => c.id === state.selected_cat) || CATS[0];
    glaskanieScene.setCat(cat.id);
    document.getElementById("catName").textContent = cat.name;

    renderGallery();
    renderDecos();
    renderMini();
    renderUpgrades();
  }

  function renderRoom() {
    const room = document.getElementById("room");
    const emptyMsg = document.getElementById("roomEmptyMsg");
    if (!state.owned_cats.length) {
      emptyMsg.style.display = "flex";
      return;
    }
    emptyMsg.style.display = "none";
    pokojScene.setCats(state.owned_cats);
    pokojScene.setDecos(state.owned_decos.map((id) => DECOS.find((d) => d.id === id)));
  }

  function renderGallery() {
    const gal = document.getElementById("gallery");
    gal.innerHTML = CATS.map((c) => {
      const owned = state.owned_cats.includes(c.id);
      const selected = state.selected_cat === c.id;
      return (
        '<div class="cat-card ' + (owned ? "" : "locked") + " " + (selected ? "selected" : "") + '" data-cat="' + c.id + '">' +
        '<div class="emoji">' + c.emoji + "</div>" +
        '<div class="price">' + (owned ? c.name : c.cost + " 🐾") + "</div>" +
        "</div>"
      );
    }).join("");

    gal.querySelectorAll(".cat-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.cat;
        const c = CATS.find((x) => x.id === id);
        const owned = state.owned_cats.includes(id);
        if (owned) {
          state.selected_cat = id;
          scheduleSave(true);
          renderAll();
        } else if (state.hearts >= c.cost) {
          state.hearts -= c.cost;
          state.owned_cats.push(id);
          state.selected_cat = id;
          scheduleSave(true);
          renderAll();
        }
      });
    });
  }

  function renderDecos() {
    const row = document.getElementById("decoRow");
    row.innerHTML = DECOS.map((d) => {
      const owned = state.owned_decos.includes(d.id);
      return (
        '<div class="deco-item ' + (owned ? "owned" : "") + '" data-deco="' + d.id + '">' +
        '<div class="emoji">' + d.emoji + "</div>" +
        '<div class="price">' + (owned ? "kupione" : d.cost + " 🐾") + "</div>" +
        "</div>"
      );
    }).join("");

    row.querySelectorAll(".deco-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.deco;
        const d = DECOS.find((x) => x.id === id);
        if (state.owned_decos.includes(id)) return;
        if (state.hearts >= d.cost) {
          state.hearts -= d.cost;
          state.owned_decos.push(id);
          scheduleSave(true);
          renderAll();
        }
      });
    });
  }

  /* --- głaskanie (petting) --- */
  function clickPower() { return 1 + state.click_level; }
  function passivePerSec() { return state.passive_level * 0.5; }
  function clickUpgradeCost(level) { return Math.floor(15 * Math.pow(1.15, level)); }
  function passiveUpgradeCost(level) { return Math.floor(25 * Math.pow(1.18, level)); }

  let petCooldown = false;
  document.getElementById("catStage").addEventListener("click", () => {
    if (petCooldown) return;
    petCooldown = true;
    setTimeout(() => (petCooldown = false), 250);

    const gain = clickPower();
    state.hearts += gain;
    scheduleSave();
    document.getElementById("heartsNum").textContent = Math.floor(state.hearts);
    glaskanieScene.pet();
    renderGallery();
    renderDecos();
    renderUpgrades();

    const f = document.createElement("div");
    f.className = "float";
    f.textContent = "+" + gain + " 🐾";
    f.style.left = 45 + Math.random() * 10 + "%";
    document.getElementById("floatWrap").appendChild(f);
    setTimeout(() => f.remove(), 1000);
  });

  function renderUpgrades() {
    const cCost = clickUpgradeCost(state.click_level);
    const pCost = passiveUpgradeCost(state.passive_level);
    document.getElementById("clickUpgradeInfo").textContent =
      "poziom " + state.click_level + " · +" + clickPower() + " 🐾/głaskanie · koszt " + cCost + " 🐾";
    document.getElementById("passiveUpgradeInfo").textContent =
      "poziom " + state.passive_level + " · +" + passivePerSec().toFixed(1) + " 🐾/s · koszt " + pCost + " 🐾";
    document.getElementById("clickUpgradeBtn").disabled = state.hearts < cCost;
    document.getElementById("passiveUpgradeBtn").disabled = state.hearts < pCost;
  }

  document.getElementById("clickUpgradeBtn").addEventListener("click", () => {
    const cost = clickUpgradeCost(state.click_level);
    if (state.hearts < cost) return;
    state.hearts -= cost;
    state.click_level += 1;
    scheduleSave(true);
    renderAll();
  });
  document.getElementById("passiveUpgradeBtn").addEventListener("click", () => {
    const cost = passiveUpgradeCost(state.passive_level);
    if (state.hearts < cost) return;
    state.hearts -= cost;
    state.passive_level += 1;
    scheduleSave(true);
    renderAll();
  });

  setInterval(() => {
    const gain = passivePerSec();
    if (gain > 0) {
      state.hearts = Math.round((state.hearts + gain) * 10) / 10;
      scheduleSave();
      document.getElementById("heartsNum").textContent = Math.floor(state.hearts);
      renderGallery();
      renderDecos();
      renderUpgrades();
      renderMini();
    }
  }, 1000);

  /* --- kocie sloty --- */
  function renderMini() {
    const left = Math.max(0, MINI_DAILY_LIMIT - state.mini_today);
    document.getElementById("miniBtn").style.display = left > 0 ? "block" : "none";
    document.getElementById("miniLocked").style.display = left > 0 ? "none" : "block";
    document.getElementById("miniBtn").disabled = state.hearts < MINI_COST || left <= 0;
  }

  let miniSpinning = false;
  document.getElementById("miniBtn").addEventListener("click", () => {
    if (miniSpinning) return;
    const left = MINI_DAILY_LIMIT - state.mini_today;
    if (left <= 0 || state.hearts < MINI_COST) return;
    miniSpinning = true;
    document.getElementById("miniBtn").disabled = true;
    document.getElementById("miniResult").textContent = "";

    state.hearts -= MINI_COST;
    state.mini_today += 1;
    scheduleSave(true);
    document.getElementById("heartsNum").textContent = Math.floor(state.hearts);

    const willWin = Math.random() < MINI_WIN_CHANCE;
    let finalSyms;
    if (willWin) {
      const s = MINI_SYMBOLS[Math.floor(Math.random() * MINI_SYMBOLS.length)];
      finalSyms = [s, s, s];
    } else {
      finalSyms = [0, 0, 0].map(() => MINI_SYMBOLS[Math.floor(Math.random() * MINI_SYMBOLS.length)]);
      if (finalSyms[0] === finalSyms[1] && finalSyms[1] === finalSyms[2]) {
        finalSyms[1] = MINI_SYMBOLS[(MINI_SYMBOLS.indexOf(finalSyms[1]) + 1) % MINI_SYMBOLS.length];
      }
    }
    const reelsEls = document.querySelectorAll("#miniReels .mini-reel");
    let ticks = 0;
    const iv = setInterval(() => {
      reelsEls.forEach((r) => (r.textContent = MINI_SYMBOLS[Math.floor(Math.random() * MINI_SYMBOLS.length)]));
      ticks++;
      if (ticks >= 8) {
        clearInterval(iv);
        reelsEls.forEach((r, i) => (r.textContent = finalSyms[i]));
        if (willWin) {
          const win = MINI_COST * MINI_MULT;
          state.hearts += win;
          document.getElementById("miniResult").textContent = "Miau! +" + win + " 🐾";
        } else {
          document.getElementById("miniResult").textContent = "Bez wygranej tym razem.";
        }
        scheduleSave(true);
        renderAll();
        miniSpinning = false;
      }
    }, 150);
  });

  document.getElementById("resetLink").addEventListener("click", async () => {
    if (confirm("Na pewno zresetować wszystkie kotki, serduszka i akcesoria?")) {
      state = {
        hearts: 20,
        owned_cats: ["milus"],
        selected_cat: "milus",
        owned_decos: [],
        click_level: 0,
        passive_level: 0,
        mini_last_day: todayStr(),
        mini_today: 0,
      };
      scheduleSave(true);
      renderAll();
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    flush();
    onLogout();
  });

  renderAll();
}
