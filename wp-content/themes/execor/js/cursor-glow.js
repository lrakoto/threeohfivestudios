(function () {
  var canvas, ctx, mouse = { x: -9999, y: -9999 };
  var DOT_SPACING = 28;
  var DOT_RADIUS = 1.0;
  var GLOW_RADIUS = 260;
  var ACCENT = { r: 15, g: 61, b: 58 }; // #0F3D3A

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'cursor-glow-canvas';
    canvas.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:0',
      'mix-blend-mode:overlay',
    ].join(';');
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    requestAnimationFrame(draw);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var cols = Math.ceil(canvas.width / DOT_SPACING) + 1;
    var rows = Math.ceil(canvas.height / DOT_SPACING) + 1;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = c * DOT_SPACING;
        var y = r * DOT_SPACING;

        var dx = x - mouse.x;
        var dy = y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        var proximity = Math.max(0, 1 - dist / GLOW_RADIUS);
        // ease the falloff
        proximity = proximity * proximity;

        // base dot opacity + glow boost
        var baseOpacity = 0.055;
        var glowOpacity = proximity * 0.28;
        var opacity = baseOpacity + glowOpacity;

        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS + proximity * 1.2, 0, Math.PI * 2);
        ctx.fillStyle =
          'rgba(' +
          ACCENT.r + ',' +
          ACCENT.g + ',' +
          ACCENT.b + ',' +
          opacity.toFixed(3) +
          ')';
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
