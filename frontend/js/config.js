// Kiedy frontend jest hostowany na GitHub Pages (inna domena niż backend),
// zapytania do API muszą iść pod pełny adres backendu zamiast względnej ścieżki "/api".
// Lokalnie (backend serwuje też frontend spod tego samego adresu) wystarczy ścieżka względna.
const RENDER_API_URL = "https://kocia-kawiarnia-api.onrender.com";

export const API_BASE = window.location.hostname.endsWith("github.io") ? RENDER_API_URL : "";
