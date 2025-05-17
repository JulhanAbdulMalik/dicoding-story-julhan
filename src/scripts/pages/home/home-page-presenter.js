import { getAllStories } from "../../data/api";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../../utils/notification-helper";
import StoryDB from "../../data/database";

export default class HomePagePresenter {
  constructor(view) {
    this._view = view;
  }

  async init() {
    try {
      const stories = await getAllStories({ location: 1 });

      if (stories.error) {
        throw new Error(stories.message);
      }

      this._view.showStories(stories.listStory);
      this._view.showMap(stories.listStory);
    } catch (error) {
      this._view.showError(
        "Gagal memuat Data Story<br>Silahkan cek Koneksi Internet atau melakukan Login terlebih dahulu"
      );
    }

    this.updateSubscribeButton();
  }

  async handlePushToggle() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await unsubscribePushNotification();
      } else {
        await subscribePushNotification();
      }

      this.updateSubscribeButton();
    } catch (error) {
      console.error("Gagal mengubah status langganan:", error);
    }
  }

  async updateSubscribeButton() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      this._view.updateSubscribeButtonText(!!subscription);
    } catch (error) {
      console.error("Gagal mengecek status langganan:", error);
    }
  }

  async handleSaveStory(story) {
    try {
      await StoryDB.saveStory(story);
      alert("Story berhasil disimpan ke Saved Story!");
    } catch (error) {
      console.error("Gagal menyimpan story:", error);
      alert("Gagal menyimpan Story. Silakan coba lagi.");
    }
  }
}
