import StoryDB from "../../data/database";

export default class SaveStoryPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadSavedStories() {
    const stories = await StoryDB.getAllStories();
    this.view.showStories(stories);
  }

  async deleteStory(id) {
    await StoryDB.deleteStory(id);

    this.loadSavedStories(); // update tampilan setelah delete
  }
}
