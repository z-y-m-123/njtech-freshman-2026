(function campusMapModule() {
  function normalize(value) { return String(value || '').trim().toLocaleLowerCase('zh-CN'); }
  function filterPlaces(records, query, category) {
    const needle = normalize(query);
    return records.filter((place) => (category === 'all' || place.category === category)
      && (!needle || normalize([place.title, place.category, ...(place.keywords || []), place.summary].join(' ')).includes(needle)));
  }
  function placeUrl(id) { return 'campus-map.html?place=' + encodeURIComponent(id); }
  function bd09ToGcj02(lng, lat) {
    const x = lng - 0.0065;
    const y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI * 3000 / 180);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI * 3000 / 180);
    return { lng: z * Math.cos(theta), lat: z * Math.sin(theta) };
  }
  if (typeof module !== 'undefined') module.exports = { filterPlaces, placeUrl, bd09ToGcj02 };
  if (typeof window === 'undefined' || !window.document || !window.L) return;

  const data = window.NJTECH_CAMPUS_MAP;
  const dormGalleries = {
    'old-nanyuan': { title: '南苑宿舍', files: ['old-nanyuan-01.jpg', 'old-nanyuan-02.jpg', 'old-nanyuan-03.jpg', 'old-nanyuan-04.jpg', 'old-nanyuan-05.jpg'] },
    yaqing: { title: '亚青学生公寓', files: ['yaqing-01.jpg', 'yaqing-02.jpg', 'yaqing-03.jpg', 'yaqing-04.jpg'] },
    xiangshan: { title: '象山苑学生公寓', files: ['xiangshan-01.jpg', 'xiangshan-02.jpg', 'xiangshan-03.jpg', 'xiangshan-04.jpg', 'xiangshan-05.jpg', 'xiangshan-06.jpg'] },
    tanxiang: { title: '檀香苑宿舍', files: ['tanxiang-01.jpg', 'tanxiang-02.jpg', 'tanxiang-03.jpg', 'tanxiang-04.jpg'] },
    dongyuan: { title: '东苑宿舍', files: ['dongyuan-01.jpg', 'dongyuan-02.jpg', 'dongyuan-03.jpg', 'dongyuan-04.jpg', 'dongyuan-05.jpg', 'dongyuan-06.jpg', 'dongyuan-07.jpg'] },
    xiyuan: { title: '西苑宿舍', files: ['xiyuan-01.jpg', 'xiyuan-02.jpg', 'xiyuan-03.jpg', 'xiyuan-04.jpg'] }
  };
  const dormGalleryByPlaceId = { 'reference-11': 'yaqing', 'reference-45': 'old-nanyuan', 'reference-46': 'xiyuan', 'reference-47': 'dongyuan', 'reference-49': 'xiangshan' };
  const els = {
    search: document.querySelector('#mapSearch'), filters: document.querySelector('#mapFilters'), list: document.querySelector('#mapResults'),
    count: document.querySelector('#mapCount'), detail: document.querySelector('#placeDetail'), detailTitle: document.querySelector('#placeDetailTitle'),
    detailMeta: document.querySelector('#placeDetailMeta'), detailBody: document.querySelector('#placeDetailBody'), detailNav: document.querySelector('#placeDetailNav'), detailPanorama: document.querySelector('#placeDetailPanorama'),
    detailFigure: document.querySelector('#placeDetailFigure'), detailImage: document.querySelector('#placeDetailImage'), detailCaption: document.querySelector('#placeDetailCaption'),
    detailGallery: document.querySelector('#placeDetailGallery'), galleryDialog: document.querySelector('#dormGalleryDialog'), galleryTitle: document.querySelector('#dormGalleryTitle'), galleryTabs: document.querySelector('#dormGalleryTabs'), galleryGrid: document.querySelector('#dormGalleryGrid'),
    detailSource: document.querySelector('#placeDetailSource'), map: document.querySelector('#liveCampusMap'), guide: document.querySelector('#highResCampusGuide'),
    guideMarkers: document.querySelector('#highResGuideMarkers'), viewButtons: document.querySelectorAll('[data-map-view]'), legendTitle: document.querySelector('#mapLegendTitle'), legendCopy: document.querySelector('#mapLegendCopy'),
  };
  if (!data || !els.search || !els.map) return;

  const categoryMap = new Map(data.categories.map((category) => [category.id, category]));
  const state = { query: '', category: 'all', selectedId: new URLSearchParams(window.location.search).get('place') || '', view: 'live' };
  const map = window.L.map(els.map, { zoomControl: true, attributionControl: true }).setView([32.084, 118.64], 15);
  window.L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', { subdomains: ['1', '2', '3', '4'], maxZoom: 19, attribution: '&copy; 高德地图（底图）/ 点位来源：公开地图资料' }).addTo(map);
  const layer = window.L.layerGroup().addTo(map);

  function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
  function navigationUrl(query) { return 'https://www.amap.com/search?query=' + encodeURIComponent(query); }
  function panoramaUrl(scene) { return 'https://qj.720pai.cn/tour/30346f8ad62d8544?Tid=' + encodeURIComponent(scene); }
  function dormPhotoUrl(file) { return 'assets/dorm-gallery/latest/' + file; }
  function visiblePlaces() { return filterPlaces(data.places, state.query, state.category); }
  function mapPoint(place) {
    return bd09ToGcj02(place.bdLng, place.bdLat);
  }
  function markerIcon(place) {
    const category = categoryMap.get(place.category);
    return window.L.divIcon({ className: 'campus-marker-wrap', html: '<span class="campus-marker campus-marker-' + escapeHtml(place.category) + '"><i>' + escapeHtml(category.marker) + '</i></span>', iconSize: [32, 32], iconAnchor: [16, 30] });
  }
  function setMapView(view) {
    state.view = view === 'guide' ? 'guide' : 'live';
    els.map.hidden = state.view !== 'live';
    els.guide.hidden = state.view !== 'guide';
    els.viewButtons.forEach((button) => {
      const active = button.dataset.mapView === state.view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    els.legendTitle.textContent = state.view === 'guide' ? '高清图导览' : '地点定位参考';
    els.legendCopy.textContent = state.view === 'guide' ? '标记为原高清图上的宿舍资料位置，点击查看图片。' : '公开 BD-09 点位已转换为高德底图坐标';
    if (state.view === 'live') window.setTimeout(() => map.invalidateSize(), 0);
    renderGuideMarkers();
  }
  function renderGuideMarkers() {
    if (!els.guideMarkers) return;
    const places = visiblePlaces().filter((place) => Number.isFinite(place.guideX) && Number.isFinite(place.guideY));
    els.guideMarkers.innerHTML = places.map((place) => '<button class="guide-dorm-marker' + (state.selectedId === place.id ? ' is-selected' : '') + '" type="button" data-place-id="' + escapeHtml(place.id) + '" style="--x:' + place.guideX + '%;--y:' + place.guideY + '%"><span>宿</span><b>' + escapeHtml(place.title.replace(/学生公寓|宿舍区|宿舍/g, '')) + '</b></button>').join('');
  }
  function showDormGallery() {
    if (!els.galleryDialog) return;
    try {
      if (!els.galleryDialog.open) els.galleryDialog.showModal();
    } catch {
      els.galleryDialog.setAttribute('open', '');
      els.galleryDialog.classList.add('is-fallback-open');
    }
  }
  function closeDormGallery() {
    if (!els.galleryDialog) return;
    if (els.galleryDialog.open && typeof els.galleryDialog.close === 'function') els.galleryDialog.close();
    els.galleryDialog.removeAttribute('open');
    els.galleryDialog.classList.remove('is-fallback-open');
  }
  function openDormGallery(id) {
    const gallery = dormGalleries[id];
    if (!gallery || !els.galleryGrid) return;
    els.galleryTitle.textContent = gallery.title + ' · ' + gallery.files.length + ' 张实拍';
    els.galleryTabs.innerHTML = Object.entries(dormGalleries).map(([key, item]) => '<button class="' + (key === id ? 'is-active' : '') + '" type="button" data-dorm-gallery="' + key + '">' + escapeHtml(item.title.replace('学生公寓', '').replace('宿舍', '')) + '</button>').join('');
    els.galleryGrid.innerHTML = gallery.files.map((file, index) => {
      const src = dormPhotoUrl(file);
      return '<a href="' + src + '" target="_blank" rel="noreferrer"><img src="' + src + '" alt="' + escapeHtml(gallery.title) + '实拍 ' + (index + 1) + '" loading="lazy"></a>';
    }).join('');
    showDormGallery();
  }
  function openPlace(id, focus) {
    const place = data.places.find((item) => item.id === id);
    if (!place) return;
    state.selectedId = id;
    const category = categoryMap.get(place.category);
    els.detailTitle.textContent = place.title;
    els.detailMeta.textContent = category.label + ' · 地点参考';
    els.detailBody.textContent = place.summary;
    els.detailNav.href = navigationUrl(place.mapQuery);
    if (place.panoramaScene) {
      els.detailPanorama.href = panoramaUrl(place.panoramaScene);
      els.detailPanorama.hidden = false;
    } else {
      els.detailPanorama.removeAttribute('href');
      els.detailPanorama.hidden = true;
    }
    els.detailSource.textContent = '资料：' + place.sourceLabel + '。位置仅供查找参考，请以学校通知和实时导航为准。';
    if (place.image) {
      els.detailImage.src = place.image;
      els.detailImage.alt = place.imageAlt || place.title;
      els.detailCaption.textContent = place.imageCaption || '图片资料';
      els.detailFigure.hidden = false;
    } else {
      els.detailImage.removeAttribute('src');
      els.detailFigure.hidden = true;
    }
    const galleryId = dormGalleryByPlaceId[place.id];
    els.detailGallery.hidden = !galleryId;
    if (galleryId) els.detailGallery.dataset.dormGallery = galleryId;
    else delete els.detailGallery.dataset.dormGallery;
    els.detail.hidden = false;
    window.history.replaceState(null, '', placeUrl(id));
    if (focus) { const point = mapPoint(place); map.setView([point.lat, point.lng], Math.max(map.getZoom(), 17), { animate: true }); }
    render();
  }
  function render() {
    const places = visiblePlaces();
    els.count.textContent = places.length + ' 个地点';
    els.list.innerHTML = places.map((place) => '<button class="map-result' + (state.selectedId === place.id ? ' is-selected' : '') + '" type="button" data-place-id="' + escapeHtml(place.id) + '"><span>' + escapeHtml(categoryMap.get(place.category).marker) + '</span><strong>' + escapeHtml(place.title) + '</strong><small>' + escapeHtml(categoryMap.get(place.category).label) + '</small></button>').join('');
    els.filters.querySelectorAll('button').forEach((button) => button.classList.toggle('is-active', button.dataset.category === state.category));
    layer.clearLayers();
    places.forEach((place) => {
      const point = mapPoint(place);
      const marker = window.L.marker([point.lat, point.lng], { icon: markerIcon(place), keyboard: true, title: place.title });
      marker.on('click', () => openPlace(place.id, false));
      marker.addTo(layer);
    });
    renderGuideMarkers();
  }
  els.search.addEventListener('input', () => { state.query = els.search.value; render(); });
  els.filters.addEventListener('click', (event) => { const button = event.target.closest('[data-category]'); if (button) { state.category = button.dataset.category; render(); } });
  els.list.addEventListener('click', (event) => { const target = event.target.closest('[data-place-id]'); if (target) openPlace(target.dataset.placeId, true); });
  els.guideMarkers.addEventListener('click', (event) => { const target = event.target.closest('[data-place-id]'); if (target) openPlace(target.dataset.placeId, false); });
  els.viewButtons.forEach((button) => button.addEventListener('click', () => setMapView(button.dataset.mapView)));
  els.detailGallery.addEventListener('click', () => openDormGallery(els.detailGallery.dataset.dormGallery));
  els.galleryDialog.addEventListener('click', (event) => {
    if (event.target === els.galleryDialog || event.target.closest('[data-close-dorm-gallery]')) closeDormGallery();
    const tab = event.target.closest('[data-dorm-gallery]');
    if (tab) openDormGallery(tab.dataset.dormGallery);
  });
  document.querySelector('[data-close-place]').addEventListener('click', () => { els.detail.hidden = true; state.selectedId = ''; window.history.replaceState(null, '', 'campus-map.html'); render(); });
  render();
  if (state.selectedId) openPlace(state.selectedId, true);
  const galleryId = new URLSearchParams(window.location.search).get('gallery');
  if (galleryId) openDormGallery(galleryId);
}());
