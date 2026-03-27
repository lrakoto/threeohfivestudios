(function () {
  var canvas, ctx;
  var time = 0;
  var mouse = { x: -9999, y: -9999 };
  var hasEntered = false;
  var ACCENT = { r: 15, g: 61, b: 58 }; // #0F3D3A

  var POINTS = 36;
  var SPRING = 0.08;
  var FRICTION = 0.78;

  // Two edge strands that define the ribbon width
  var strandA = [];
  var strandB = [];

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

    for (var i = 0; i < POINTS; i++) {
      strandA.push({ x: -9999, y: -9999, vx: 0, vy: 0 });
      strandB.push({ x: -9999, y: -9999, vx: 0, vy: 0 });
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(loop);
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!hasEntered) {
      for (var i = 0; i < POINTS; i++) {
        strandA[i].x = mouse.x;
        strandA[i].y = mouse.y;
        strandB[i].x = mouse.x;
        strandB[i].y = mouse.y;
      }
      hasEntered = true;
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function loop() {
    time += 0.016;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!hasEntered) {
      requestAnimationFrame(loop);
      return;
    }

    // Ribbon width tapers from head to tail
    var ribbonWidth = 5;

    // Head of both strands anchors near cursor, offset perpendicular to movement
    var dx = strandA[0].vx;
    var dy = strandA[0].vy;
    var speed = Math.sqrt(dx * dx + dy * dy) || 0.001;
    var nx = -dy / speed;
    var ny = dx / speed;

    // Gentle twist: offset rotates slowly over time
    var twist = Math.sin(time * 0.25) * ribbonWidth * 0.6;
    var targetAx = mouse.x + nx * (ribbonWidth + twist);
    var targetAy = mouse.y + ny * (ribbonWidth + twist);
    var targetBx = mouse.x - nx * (ribbonWidth - twist);
    var targetBy = mouse.y - ny * (ribbonWidth - twist);

    // Spring head of each strand toward target
    updatePoint(strandA[0], targetAx, targetAy, SPRING * 1.4, FRICTION);
    updatePoint(strandB[0], targetBx, targetBy, SPRING * 1.4, FRICTION);

    // Trail each point behind the one before it, with increasing lag
    for (var i = 1; i < POINTS; i++) {
      var lag = 1 - (i / POINTS) * 0.4;
      updatePoint(strandA[i], strandA[i - 1].x, strandA[i - 1].y, SPRING * lag, FRICTION);
      updatePoint(strandB[i], strandB[i - 1].x, strandB[i - 1].y, SPRING * lag, FRICTION);
    }

    drawRibbon();
    requestAnimationFrame(loop);
  }

  function updatePoint(pt, tx, ty, spring, friction) {
    pt.vx += (tx - pt.x) * spring;
    pt.vy += (ty - pt.y) * spring;
    pt.vx *= friction;
    pt.vy *= friction;
    pt.x += pt.vx;
    pt.y += pt.vy;
  }

  function drawRibbon() {
    if (strandA.length < 2) return;
    ctx.save();

    // Build ribbon as a filled path from strandA forward, strandB backward
    ctx.beginPath();
    ctx.moveTo(strandA[0].x, strandA[0].y);

    for (var i = 1; i < POINTS - 1; i++) {
      var mx = (strandA[i].x + strandA[i + 1].x) * 0.5;
      var my = (strandA[i].y + strandA[i + 1].y) * 0.5;
      ctx.quadraticCurveTo(strandA[i].x, strandA[i].y, mx, my);
    }
    ctx.lineTo(strandA[POINTS - 1].x, strandA[POINTS - 1].y);
    ctx.lineTo(strandB[POINTS - 1].x, strandB[POINTS - 1].y);

    for (var j = POINTS - 2; j > 0; j--) {
      var mx2 = (strandB[j].x + strandB[j + 1].x) * 0.5;
      var my2 = (strandB[j].y + strandB[j + 1].y) * 0.5;
      ctx.quadraticCurveTo(strandB[j + 1].x, strandB[j + 1].y, mx2, my2);
    }
    ctx.lineTo(strandB[0].x, strandB[0].y);
    ctx.closePath();

    // Gradient from head (more visible) to tail (transparent)
    var grad = ctx.createLinearGradient(
      strandA[0].x, strandA[0].y,
      strandA[POINTS - 1].x, strandA[POINTS - 1].y
    );
    grad.addColorStop(0, 'rgba(' + ACCENT.r + ',' + ACCENT.g + ',' + ACCENT.b + ',0.10)');
    grad.addColorStop(0.3, 'rgba(' + ACCENT.r + ',' + ACCENT.g + ',' + ACCENT.b + ',0.05)');
    grad.addColorStop(1, 'rgba(' + ACCENT.r + ',' + ACCENT.g + ',' + ACCENT.b + ',0.0)');

    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle edge stroke along strandA
    ctx.beginPath();
    ctx.moveTo(strandA[0].x, strandA[0].y);
    for (var k = 1; k < POINTS - 1; k++) {
      var emx = (strandA[k].x + strandA[k + 1].x) * 0.5;
      var emy = (strandA[k].y + strandA[k + 1].y) * 0.5;
      ctx.quadraticCurveTo(strandA[k].x, strandA[k].y, emx, emy);
    }
    ctx.strokeStyle = 'rgba(' + ACCENT.r + ',' + ACCENT.g + ',' + ACCENT.b + ',0.10)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
