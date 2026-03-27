(function () {
  var canvas, ctx;
  var mouse = { x: -9999, y: -9999 };
  var hasEntered = false;
  var ACCENT = { r: 15, g: 61, b: 58 }; // #0F3D3A

  var NUM_THREADS = 3;
  var POINTS = 22;

  // Each thread has slightly different lag — gives depth without looking like creatures
  var threadDefs = [
    { spring: 0.18, friction: 0.72, opacity: 0.22, width: 0.8 },
    { spring: 0.12, friction: 0.68, opacity: 0.15, width: 0.6 },
    { spring: 0.08, friction: 0.65, opacity: 0.10, width: 0.5 },
  ];

  var threads = [];

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

    for (var i = 0; i < NUM_THREADS; i++) {
      var pts = [];
      for (var j = 0; j < POINTS; j++) {
        pts.push({ x: -9999, y: -9999, vx: 0, vy: 0 });
      }
      threads.push({ points: pts, def: threadDefs[i] });
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(loop);
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!hasEntered) {
      // Snap all points to cursor on first entry
      for (var i = 0; i < threads.length; i++) {
        for (var j = 0; j < POINTS; j++) {
          threads[i].points[j].x = mouse.x;
          threads[i].points[j].y = mouse.y;
        }
      }
      hasEntered = true;
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!hasEntered) {
      requestAnimationFrame(loop);
      return;
    }

    for (var i = 0; i < threads.length; i++) {
      var t = threads[i];
      var d = t.def;
      var pts = t.points;

      // Head chases cursor
      pts[0].vx += (mouse.x - pts[0].x) * d.spring;
      pts[0].vy += (mouse.y - pts[0].y) * d.spring;
      pts[0].vx *= d.friction;
      pts[0].vy *= d.friction;
      pts[0].x += pts[0].vx;
      pts[0].y += pts[0].vy;

      // Each point chases the one ahead with the same spring/friction
      for (var j = 1; j < POINTS; j++) {
        pts[j].vx += (pts[j - 1].x - pts[j].x) * d.spring;
        pts[j].vy += (pts[j - 1].y - pts[j].y) * d.spring;
        pts[j].vx *= d.friction;
        pts[j].vy *= d.friction;
        pts[j].x += pts[j].vx;
        pts[j].y += pts[j].vy;
      }

      drawThread(pts, d);
    }

    requestAnimationFrame(loop);
  }

  function drawThread(pts, d) {
    if (pts.length < 3) return;
    ctx.save();
    ctx.lineWidth = d.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(' + ACCENT.r + ',' + ACCENT.g + ',' + ACCENT.b + ',' + d.opacity + ')';

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);

    // Smooth catmull-rom style curve through points
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i].x + pts[i + 1].x) * 0.5;
      var my = (pts[i].y + pts[i + 1].y) * 0.5;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
    ctx.restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
