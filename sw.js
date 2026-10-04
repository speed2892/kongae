/* 공개강연 앱 서비스 워커
   - 컴퓨터(크롬·엣지)에서 "앱 설치"가 뜨게 해 줌
   - 항상 인터넷에서 최신 파일을 먼저 받고, 인터넷이 끊기면 마지막으로 받은 화면을 보여 줌 */
const CACHE = 'kongae-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  // 같은 사이트의 GET 요청만 (Firebase·글꼴 등 다른 사이트는 건드리지 않음)
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
