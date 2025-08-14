async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw Error(`Failed fetch ${res.status}`);
  return res.text();
}

const base = "https://anime4up.cam";

const Source = {
  id: "anime4up",
  name: "Anime4Up (Arabic)",
  type: "anime",
  languages: ["ar"],

  async search(query) {
    const html = await fetchText(`${base}/?search_param=animes&s=${encodeURIComponent(query)}`);
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll(".anime-card-container")).map(el => ({
      title: el.querySelector(".anime-card-title h3 a")?.textContent.trim(),
      url: el.querySelector(".anime-card-title h3 a")?.href
    }));
  },

  async fetchAnimeInfo(item) {
    const html = await fetchText(item.url);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const title = doc.querySelector(".anime-title h1")?.textContent.trim();
    const episodes = Array.from(doc.querySelectorAll(".episodes-list .episodes-card a")).map(el => ({
      title: el.textContent.trim(),
      url: el.href
    }));
    return { title, episodes };
  },

  async fetchEpisodeSources(ep) {
    const html = await fetchText(ep.url);
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll(".download-links a[href^='http']")).map(el => ({
      url: el.href
    }));
  }
};

registerSource(Source);
export default Source;
