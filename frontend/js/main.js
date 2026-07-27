import { initAuthScreen } from "./auth-ui.js";
import { startGame } from "./game.js";

function showApp() {
  document.getElementById("appScreen").classList.add("active");
}

async function boot() {
  const authUI = initAuthScreen({
    onAuthenticated: async () => {
      showApp();
      try {
        await startGame({
          onLogout: () => {
            localStorage.removeItem("kocia_kawiarnia_token");
            location.reload();
          },
        });
      } catch (err) {
        if (err && err.status === 401) {
          localStorage.removeItem("kocia_kawiarnia_token");
          location.reload();
        } else {
          console.error(err);
        }
      }
    },
  });

  if (!authUI.tryAutoLogin()) {
    authUI.show();
  }
}

boot();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Relative path (not "/sw.js") so it still resolves correctly when the
    // app is hosted under a subpath, e.g. GitHub Pages project sites.
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
