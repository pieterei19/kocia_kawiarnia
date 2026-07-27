import { catSvgMarkup } from "./cat-svg.js";
import { roomBackgroundSvg } from "./room-bg.js";

export function createPokojScene(container) {
  let roamIntervals = [];
  let bgInjected = false;

  function ensureBackground() {
    if (bgInjected) return;
    const bg = document.createElement("div");
    bg.className = "room-bg";
    bg.innerHTML = roomBackgroundSvg();
    container.insertBefore(bg, container.firstChild);
    bgInjected = true;
  }

  function setCats(catIds) {
    ensureBackground();
    roamIntervals.forEach((iv) => clearInterval(iv));
    roamIntervals = [];
    container.querySelectorAll(".roaming-cat").forEach((el) => el.remove());

    catIds.forEach((id, i) => {
      const el = document.createElement("div");
      el.className = "roaming-cat";
      el.innerHTML = catSvgMarkup(id);
      el.style.left = 10 + Math.random() * 70 + "%";
      el.style.top = 30 + Math.random() * 46 + "%";
      container.appendChild(el);

      function wander() {
        const newLeft = 6 + Math.random() * 76;
        const newTop = 26 + Math.random() * 52;
        const curLeft = parseFloat(el.style.left);
        el.style.transform = newLeft < curLeft ? "scaleX(-1)" : "scaleX(1)";
        el.style.left = newLeft + "%";
        el.style.top = newTop + "%";
      }
      const delay = 2600 + Math.random() * 2200 + i * 300;
      roamIntervals.push(setInterval(wander, delay));
    });
  }

  function setDecos(decoItems) {
    ensureBackground();
    container.querySelectorAll(".roaming-deco").forEach((el) => el.remove());
    decoItems.forEach((d, i) => {
      if (!d) return;
      const el = document.createElement("div");
      el.className = "roaming-deco";
      el.textContent = d.emoji;
      const slotWidth = 100 / (decoItems.length + 1);
      el.style.left = slotWidth * (i + 1) - 3 + "%";
      container.appendChild(el);
    });
  }

  return {
    setCats,
    setDecos,
    resize() {},
    dispose() {
      roamIntervals.forEach((iv) => clearInterval(iv));
      roamIntervals = [];
    },
  };
}
