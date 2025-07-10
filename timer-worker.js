let startTime = null;
let elapsedBeforePause = 0;
let running = false;

function tick() {
  if (!running) return;
  const now = Date.now();
  const elapsedMs = now - startTime + elapsedBeforePause;
  const elapsedSec = Math.floor(elapsedMs / 1000);
  postMessage({ type: 'tick', elapsedSeconds: elapsedSec });
  setTimeout(tick, 1000);
}

onmessage = function (e) {
  const msg = e.data;

  switch (msg.command) {
    case 'start':
      if (!running) {
        startTime = Date.now();
        running = true;
        tick();
      }
      break;
    case 'pause':
      if (running) {
        elapsedBeforePause += Date.now() - startTime;
        running = false;
      }
      break;
    case 'reset':
      running = false;
      startTime = null;
      elapsedBeforePause = 0;
      postMessage({ type: 'tick', elapsedSeconds: 0 });
      break;
  }
};
