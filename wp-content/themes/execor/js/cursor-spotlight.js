(function () {
  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var pos = { x: mouse.x, y: mouse.y };
  var SIZE = 700;
  var HALF = SIZE / 2;
  var glow;

  function init() {
    glow = document.createElement('div');
    glow.id = 'cursor-spotlight';
    glow.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:' + SIZE + 'px',
      'height:' + SIZE + 'px',
      'border-radius:50%',
      'pointer-events:none',
      'z-index:1',
      'background:radial-gradient(circle, rgba(200,248,169,0.08) 0%, rgba(200,248,169,0.04) 35%, transparent 70%)',
      'will-change:transform',
      'transform:translate(' + (-HALF) + 'px,' + (-HALF) + 'px)',
    ].join(';');
    document.body.appendChild(glow);

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    requestAnimationFrame(animate);
  }

  function animate() {
    pos.x += (mouse.x - pos.x) * 0.07;
    pos.y += (mouse.y - pos.y) * 0.07;
    glow.style.transform = 'translate(' + (pos.x - HALF) + 'px,' + (pos.y - HALF) + 'px)';
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
