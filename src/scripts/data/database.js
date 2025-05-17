import { openDB } from "idb";

const DATABASE_NAME = "dicodingstory";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "saved-story";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    }
  },
});

const StoryDB = {
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async saveStory(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default StoryDB;
