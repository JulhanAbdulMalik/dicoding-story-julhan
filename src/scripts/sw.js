import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  NetworkFirst,
  CacheFirst,
} from "workbox-strategies";

// Push Notification
self.addEventListener("push", (event) => {
  console.log("Push event diterima", event);

  let data = {
    title: "Notifikasi Baru!",
    options: {
      body: "Anda menerima notifikasi baru.",
    },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      console.error("Gagal parsing data push:", err);
    }
  }

  event.waitUntil(self.registration.showNotification(data.title, data.options));
});

// Precaching dan Runtime caching
precacheAndRoute(self.__WB_MANIFEST);

// HTML (Application Shell)
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
  })
);

// Asset JS, CSS, dan worker
registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: "assets",
  })
);

// CDN leaflet
registerRoute(
  ({ url }) => url.origin === "https://unpkg.com",
  new CacheFirst({
    cacheName: "external-resources",
  })
);
