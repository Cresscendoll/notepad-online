let startTime = null;
let elapsedBeforePause = 0;
let running = false;

function tick() {
  if (!running) return;
  const now = Date.now();
  const elapsed = now - startTime + elapsedBeforePause;
  postMessage({ type: 'tick', elapsed });
  setTimeout(tick, 1000); // раз в секунду
}

onmessage = function (e) {
  const msg = e.data;

  if (msg.type === 'start') {
    if (!running) {
      startTime = Date.now();
      running = true;
      tick();
    }
  } else if (msg.type === 'pause') {
    if (running) {
      elapsedBeforePause += Date.now() - startTime;
      running = false;
    }
  } else if (msg.type === 'reset') {
    running = false;
    startTime = null;
    elapsedBeforePause = 0;
    postMessage({ type: 'tick', elapsed: 0 });
  }
};
