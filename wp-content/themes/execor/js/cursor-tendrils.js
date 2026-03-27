(function () {
  var canvas, ctx;
  var time = 0;
  var mouse = { x: -9999, y: -9999 };
  var origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var lastMouse = { x: -9999, y: -9999 };
  var mouseVel = { x: 0, y: 0 };
  var isMoving = false;
  var moveTimeout;

  var NUM_TENDRILS = 5;
  var POINTS = 14;
  var ACCENT = { r: 15, g: 61, b: 58 }; // #0F3D3A

  var tendrils = [];

  var tendrilDefs = [
    { freq: 1.0,  freqY: 0.7,  amp: 48, phase: 0,                   spring: 0.10, friction: 0.82 },
    { freq: 0.85, freqY: 1.1,  amp: 38, phase: Math.PI * 0.4,       spring: 0.09, friction: 0.80 },
    { freq: 1.2,  freqY: 0.9,  amp: 55, phase: Math.PI * 0.8,       spring: 0.11, friction: 0.84 },
    { freq: 0.7,  freqY: 1.3,  amp: 32, phase: Math.PI * 1.2,       spring: 0.08, friction: 0.79 },
    { freq: 1.1,  freqY: 0.6,  amp: 44, phase: Math.PI * 1.6,       spring: 0.10, friction: 0.83 },
  ];

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'cursor-tendrils-canvas';
    canvas.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:1',
    ].join(';');
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
    resize();

    // Init tendrils
    for (var i = 0; i < NUM_TENDRILS; i++) {
      var pts = [];
      for (var j = 0; j < POINTS; j++) {
        pts.push({ x: origin.x, y: origin.y, vx: 0, vy: 0 });
      }
      tendrils.push({ points: pts, def: tendrilDefs[i] });
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(loop);
  }

  function onMouseMove(e) {
    mouseVel.x = e.clientX - mouse.x;
    mouseVel.y = e.clientY - mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Smoothly move origin toward cursor
    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function () {
      isMoving = false;
    }, 120);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function loop() {
    time += 0.012;

    // Ease origin toward cursor
    var easeFactor = isMoving ? 0.12 : 0.04;
    origin.x += (mouse.x - origin.x) * easeFactor;
    origin.y += (mouse.y - origin.y) * easeFactor;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < tendrils.length; i++) {
      var t = tendrils[i];
      var d = t.def;

      // Tendril head orbits origin
      var orbitScale = isMoving ? 0.3 : 1.0;
      var headX = origin.x + Math.cos(time * d.freq + d.phase) * d.amp * orbitScale;
      var headY = origin.y + Math.sin(time * d.freqY + d.phase) * d.amp * 0.6 * orbitScale;

      // Spring head toward orbit target
      var head = t.points[0];
      head.vx += (headX - head.x) * d.spring;
      head.vy += (headY - head.y) * d.spring;
      head.vx *= d.friction;
      head.vy *= d.friction;
      head.x += head.vx;
      head.y += head.vy;

      // Each subsequent point follows the one before
      for (var j = 1; j < POINTS; j++) {
        var prev = t.points[j - 1];
        var curr = t.points[j];
        curr.vx += (prev.x - curr.x) * (d.spring * 0.7);
        curr.vy += (prev.y - curr.y) * (d.spring * 0.7);
        curr.vx *= d.friction;
        curr.vy *= d.friction;
        curr.x += curr.vx;
        curr.y += curr.vy;
      }

      drawTendril(t.points);
    }

    requestAnimationFrame(loop);
  }

  function drawTendril(pts) {
    if (pts.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw segments with fading opacity toward tail
    for (var i = 0; i < pts.length - 1; i++) {
      var progress = 1 - i / (pts.length - 1);
      var opacity = progress * progress * 0.18;
      var width = progress * 1.8;

      ctx.beginPath();
      ctx.moveTo(pts[i].x, pts[i].y);

      // Smooth curve through midpoints
      var mx = (pts[i].x + pts[i + 1].x) / 2;
      var my = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);

      ctx.strokeStyle = 'rgba(' + ACCENT.r + ',' + ACCENT.g + ',' + ACCENT.b + ',' + opacity.toFixed(3) + ')';
      ctx.lineWidth = width;
      ctx.stroke();
    }

    ctx.restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
