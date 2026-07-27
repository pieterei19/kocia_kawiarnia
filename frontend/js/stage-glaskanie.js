import { catSvgMarkup } from "./cat-svg.js";

// Zastępuje wcześniejszą scenę Three.js płaską grafiką 2D (SVG) - prostsze,
// lżejsze i bliższe stylowi referencyjnemu (gruby kontur, pseudo-3D cieniowanie).
export function createGlaskanieScene(container) {
  function setCat(colorKey) {
    container.innerHTML = catSvgMarkup(colorKey);
  }

  function pet() {
    container.classList.remove("pet-bounce");
    void container.offsetWidth; // restart animacji
    container.classList.add("pet-bounce");
  }

  return {
    setCat,
    pet,
    resize() {},
    dispose() {
      container.innerHTML = "";
    },
  };
}
