const staticDevCoffee = "SucureNotes-v1";
const assets = ["/", "/index.html", "/style.css", "/script.js"];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then((cache) => {
      cache.addAll(assets);
    })
  );
});
