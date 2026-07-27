import { login, register, getToken, clearToken } from "./api.js";

export function initAuthScreen({ onAuthenticated }) {
  const screen = document.getElementById("authScreen");
  const form = document.getElementById("authForm");
  const usernameInput = document.getElementById("authUsername");
  const passwordInput = document.getElementById("authPassword");
  const errorBox = document.getElementById("authError");
  const submitBtn = document.getElementById("authSubmitBtn");
  const modeToggle = document.getElementById("authModeToggle");
  const title = document.getElementById("authTitle");

  let mode = "login"; // or "register"

  function applyMode() {
    if (mode === "login") {
      title.textContent = "Zaloguj się";
      submitBtn.textContent = "Zaloguj";
      modeToggle.textContent = "Nie masz konta? Zarejestruj się";
    } else {
      title.textContent = "Załóż konto";
      submitBtn.textContent = "Zarejestruj";
      modeToggle.textContent = "Masz już konto? Zaloguj się";
    }
    errorBox.textContent = "";
  }

  modeToggle.addEventListener("click", () => {
    mode = mode === "login" ? "register" : "login";
    applyMode();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username.length < 3 || password.length < 6) {
      errorBox.textContent = "Podaj nazwę użytkownika (min. 3 znaki) i hasło (min. 6 znaków).";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Chwileczkę...";
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      screen.classList.remove("active");
      onAuthenticated();
    } catch (err) {
      errorBox.textContent = err.message || "Coś poszło nie tak.";
    } finally {
      submitBtn.disabled = false;
      applyMode();
    }
  });

  applyMode();

  return {
    show() {
      screen.classList.add("active");
    },
    hide() {
      screen.classList.remove("active");
    },
    tryAutoLogin() {
      if (getToken()) {
        onAuthenticated();
        return true;
      }
      return false;
    },
    logout() {
      clearToken();
      screen.classList.add("active");
    },
  };
}
