import HomePagePresenter from "./home-page-presenter";

export default class HomePage {
  constructor() {
    this._presenter = null;
  }

  async render() {
    return `
      <section class="container" id="main-content" role="main">
        <div class="story-header">
          <h1>Story List</h1>
          <div class="button-home-page">
            <button id="subscribe-button" class="subscribe-button">Subscribe</button>
            <a id="tambah-story-button" href="#/tambah-story">Tambah Story ➕</a>
          </div>
        </div>
        <div id="story-list" class="story-list" aria-live="polite"></div>
        <div id="map" class="map-container" role="region" aria-label="Story Location Map"></div>
      </section>
    `;
  }

  async afterRender() {
    this._presenter = new HomePagePresenter(this);
    await this._presenter.init();

    const subscribeBtn = document.getElementById("subscribe-button");
    subscribeBtn.addEventListener("click", () =>
      this._presenter.handlePushToggle()
    );
  }

  showStories(stories) {
    const storyListContainer = document.querySelector("#story-list");
    storyListContainer.innerHTML = "";

    stories.forEach((story) => {
      const storyItem = document.createElement("article");
      storyItem.className = "story-item";

      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita dari ${
        story.name
      }" loading="lazy" />
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <p><strong>🕑 Dibuat:</strong> ${story.createdAt}</p>
        <p><strong>📍 Lokasi:</strong> ${
          story.lat ? `${story.lat}, ${story.lon}` : "Tidak tersedia"
        }</p>
        
        <button class="save-story-button">Save Story 💾</button>
      `;

      const saveButton = storyItem.querySelector(".save-story-button");
      saveButton.addEventListener("click", () => {
        this._presenter.handleSaveStory(story);
      });

      storyListContainer.appendChild(storyItem);
    });
  }

  showMap(stories) {
    const mapContainer = document.querySelector("#map");
    mapContainer.innerHTML = "";

    if (!stories.length) return;

    const map = L.map(mapContainer).setView(
      [stories[0].lat || -6.2, stories[0].lon || 106.8],
      5
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(
          `<strong>${story.name}</strong><br>${story.description}`
        );
      }
    });
  }

  updateSubscribeButtonText(isSubscribed) {
    const button = document.getElementById("subscribe-button");
    button.textContent = isSubscribed ? "Unsubscribe 🔕" : "Subscribe 🔔";
  }

  showError(message) {
    const storyListContainer = document.querySelector("#story-list");
    storyListContainer.innerHTML = `<p class="error">${message}</p>`;
  }
}
