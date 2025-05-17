import SaveStoryPresenter from "./save-story-presenter";

export default class SaveStoryPage {
  constructor() {
    this.presenter = new SaveStoryPresenter(this);
  }

  async render() {
    return `
      <section class="container" id="main-content" role="main">
        <h1>Saved Story</h1>
        <br>
        <div id="saved-story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.presenter.loadSavedStories();
  }

  showStories(stories) {
    const container = document.querySelector("#saved-story-list");
    container.innerHTML = "";

    if (!stories.length) {
      container.innerHTML = "<p>Belum ada Story yang disimpan.</p>";
      return;
    }

    stories.forEach((story) => {
      const storyItem = document.createElement("article");
      storyItem.className = "story-item";
      storyItem.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" loading="lazy" />
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <p><strong>🕑 Dibuat:</strong> ${story.createdAt}</p>

        <button class="delete-story" data-id="${story.id}">Hapus Story 🗑️</button>
      `;

      storyItem
        .querySelector(".delete-story")
        .addEventListener("click", (e) => {
          const id = e.target.dataset.id;
          this.presenter.deleteStory(id);
        });

      container.appendChild(storyItem);
    });
  }
}
