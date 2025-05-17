// Service Worker
export function isServiceWorkerAvailable() {
  return "serviceWorker" in navigator;
}

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.bundle.js")
        .then((reg) => console.log("Service worker registered:", reg))
        .catch((err) =>
          console.error("Service worker registration failed:", err)
        );
    });
  }
}
