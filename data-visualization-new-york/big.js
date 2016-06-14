window.onload = function() {
  var cx = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2,
      cy = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 2;

  var flyToInterval, flyToInterval2;

  //var s = document.getElementsByTagName('div'), cur = 0, ti;
  var s = document.querySelectorAll("body > div"), cur = 0, ti;
  var bg = document.getElementById('background-image');
  var tr = 0;
  if (!s) return;
  function go(n) {

    cur = n;
    var i = 1e3, e = s[n], t;
    for (var k = 0; k < s.length; k++) s[k].style.display = 'none';
    e.style.display = 'inline';

    if (!(e.className.indexOf('iframe') > -1 || e.className.indexOf('video') > -1)) {
      e.style.fontSize = i + 'px';
    };

    // Mapbox GL stuff...
    if (e.id === 'mapbox-gl') {
      map.resize();
      flyToInterval = window.setInterval(flyToChapter, 20000);

      flyToInterval2 = window.setInterval(function() {
        clearInterval(flyToInterval2);
        flyToChapter();
      }, 2000);

    } else {
      clearInterval(flyToInterval);
    }

    e.style.display = 'inline';
    if (e.firstChild.nodeName === 'IMG') {
      bg.style.backgroundImage = 'url(' + e.firstChild.src + ')';
      bg.style.display = 'inline';
      e.style.display = 'none';

      bg.style.backgroundColor = 'white';

      e.firstChild.style.display = 'none';
      if ('classList' in e) e.classList.add('image-text');
    } else {
      bg.style.display = 'none';
      bg.style.backgroundImage = '';
      document.body.style.backgroundColor = e.style.backgroundColor;
    }
    if (ti !== undefined) window.clearInterval(ti);
    t = parseInt(e.getAttribute('time-to-next') || 0, 10);
    if (t > 0) ti = window.setTimeout(fwd, (t * 1000));
    while (
      e.offsetWidth > window.innerWidth ||
      e.offsetHeight > window.innerHeight) {
      e.style.fontSize = (i -= 2) + 'px';
      if (i < 0) break;
    }
    e.style.marginTop = ((window.innerHeight - e.offsetHeight) / 2) + 'px';
    if (window.location.hash !== n) window.location.hash = n;
    document.title = e.textContent || e.innerText;

  }
  document.onclick = function() { go(++cur % (s.length)); };
  function fwd() { go(Math.min(s.length - 1, ++cur)); }
  function rev() { go(Math.max(0, --cur)); }
  document.onkeydown = function(e) {
    if (e.which === 39 || e.which === 34) fwd();
    if (e.which === 37 || e.which === 33) rev();
  };
  document.ontouchstart = function(e) {
    var x0 = e.changedTouches[0].pageX;
    document.ontouchend = function(e) {
      var x1 = e.changedTouches[0].pageX;
      if (x1 - x0 < 0) fwd();
      if (x1 - x0 > 0) rev();
    };
  };
  function parse_hash() {
    return Math.max(Math.min(
      s.length - 1,
      parseInt(window.location.hash.substring(1), 10)), 0);
  }
  if (window.location.hash) cur = parse_hash() || cur;
  window.onhashchange = function() {
    var c = parse_hash();
    if (c !== cur) go(c);
  };

  go(cur);
};
