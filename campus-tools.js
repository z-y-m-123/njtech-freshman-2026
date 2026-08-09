(function campusToolsModule() {
  function normalizeText(value) {
    return String(value || '').trim().toLocaleLowerCase('zh-CN');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function amapSearchUrl(query) {
    return 'https://www.amap.com/search?query=' + encodeURIComponent(query);
  }

  function safeToolUrl(value) {
    const href = String(value || '').trim();
    if (!href || href.startsWith('//')) return '#';
    if (/^(?:[a-z0-9][a-z0-9+.-]*:)/i.test(href)) {
      try {
        return new URL(href).protocol === 'https:' ? href : '#';
      } catch {
        return '#';
      }
    }
    return href.startsWith('/') || /^[a-z0-9][a-z0-9._/-]*(?:[?#][^\s]*)?$/i.test(href) ? href : '#';
  }

  function panoramaScriptUrl(ak) {
    return 'https://api.map.baidu.com/api?v=1.0&type=webgl&ak=' + encodeURIComponent(ak);
  }

  function panoramaGeocodeUrl(address, ak, callbackName) {
    return 'https://api.map.baidu.com/geocoding/v3/?address=' + encodeURIComponent(address)
      + '&output=json&ak=' + encodeURIComponent(ak) + '&callback=' + encodeURIComponent(callbackName);
  }

  function panoramaImageUrl(lng, lat, ak) {
    return 'https://api.map.baidu.com/panorama/v2?ak=' + encodeURIComponent(ak)
      + '&width=1024&height=576&location=' + lng + ',' + lat + '&fov=100&heading=0&pitch=0';
  }

  function isPlaceRecord(record) {
    return record && record.category === '地点';
  }

  function matchesToolCategory(record, category) {
    if (category === 'all') return true;
    const text = [record.title, ...(record.keywords || [])].join(' ');
    const has = (pattern) => pattern.test(text);
    if (category === 'arrival') return record.category === '准备' || has(/迎新|报到/);
    if (category === 'campus-life') return record.category === '生活';
    if (category === 'sports') return record.category === '体育';
    if (category === 'places') return record.category === '地点';
    return false;
  }

  function filterRecords(records, query, category) {
    const needle = normalizeText(query);
    return records.filter((record) => {
      const text = [record.title, record.category, record.placeCategory, record.sportCategory, ...(record.keywords || []), record.summary || ''].join(' ');
      return matchesToolCategory(record, category)
        && (!needle || normalizeText(text).includes(needle));
    });
  }

  if (typeof module !== 'undefined') {
    module.exports = { escapeHtml, filterRecords, matchesToolCategory, safeToolUrl, amapSearchUrl, panoramaScriptUrl, panoramaGeocodeUrl, panoramaImageUrl, isPlaceRecord };
  }

  if (typeof window === 'undefined' || !window.document) return;

  const data = window.NJTECH_CAMPUS_TOOLS;
  const elements = {
    search: document.querySelector('#toolSearch'),
    filters: document.querySelector('#toolFilters'),
    checklist: document.querySelector('#toolChecklist'),
    life: document.querySelector('#toolLife'),
    everyday: document.querySelector('#toolEveryday'),
    sports: document.querySelector('#toolSports'),
    places: document.querySelector('#toolPlaces'),
    empty: document.querySelector('#toolEmpty'),
    resultStatus: document.querySelector('#toolResultStatus'),
    reset: document.querySelector('#toolReset'),
    progress: document.querySelector('#toolChecklistProgress'),
    panoramaDialog: document.querySelector('#toolPanoramaDialog'),
    panoramaTitle: document.querySelector('#toolPanoramaTitle'),
    panoramaStatus: document.querySelector('#toolPanoramaStatus'),
    panoramaCanvas: document.querySelector('#toolPanoramaCanvas'),
    panoramaMapLink: document.querySelector('[data-panorama-map-link]'),
  };
  if (!data || !elements.search) return;

  const labels = {
    'official-2026': '2026 官方',
    'reference-2024-2025': '往年参考',
    'location-reference': '地点参考',
    'official-link': '官方入口',
  };
  const state = { query: '', category: 'all', completed: loadCompleted() };
  function setPanoramaStatus(message) {
    elements.panoramaStatus.textContent = message;
  }

  function showPanoramaDialog() {
    if (!elements.panoramaDialog) return;
    try {
      if (!elements.panoramaDialog.open) elements.panoramaDialog.showModal();
    } catch {
      elements.panoramaDialog.setAttribute('open', '');
      elements.panoramaDialog.classList.add('is-fallback-open');
    }
  }

  function closePanoramaDialog() {
    if (!elements.panoramaDialog) return;
    if (typeof elements.panoramaDialog.close === 'function' && elements.panoramaDialog.open) {
      elements.panoramaDialog.close();
    }
    elements.panoramaDialog.removeAttribute('open');
    elements.panoramaDialog.classList.remove('is-fallback-open');
  }

  function jsonp(url, callbackName) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = window.setTimeout(() => cleanup(new Error('jsonp timeout')), 9000);
      function cleanup(error) {
        window.clearTimeout(timeout);
        delete window[callbackName];
        script.remove();
        if (error) reject(error);
      }
      window[callbackName] = (payload) => {
        cleanup();
        resolve(payload);
      };
      script.onerror = () => cleanup(new Error('jsonp unavailable'));
      script.src = url;
      document.head.appendChild(script);
    });
  }

  function openPanorama(query, title) {
    if (!elements.panoramaDialog || !elements.panoramaCanvas) return;
    elements.panoramaTitle.textContent = title + ' · 百度全景';
    elements.panoramaCanvas.replaceChildren();
    const mapUrl = 'https://map.baidu.com/search/' + encodeURIComponent(query);
    if (elements.panoramaMapLink) elements.panoramaMapLink.href = mapUrl;
    const ak = window.NJTECH_PANORAMA_CONFIG && window.NJTECH_PANORAMA_CONFIG.baiduMapAk;
    showPanoramaDialog();
    if (!ak) {
      setPanoramaStatus('全景服务正在配置，可直接在百度地图中继续查看。');
      return;
    }
    setPanoramaStatus('正在查找附近全景画面。');
    const callbackName = '__njtechPanorama_' + Date.now();
    jsonp(panoramaGeocodeUrl(query, ak, callbackName), callbackName).then((result) => {
      const point = result && result.result && result.result.location;
      if (!point) throw new Error('location not found');
      const link = document.createElement('a');
      link.href = mapUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.title = '在百度地图中打开';
      const image = document.createElement('img');
      image.src = panoramaImageUrl(point.lng, point.lat, ak);
      image.alt = title + '全景预览';
      image.onload = () => setPanoramaStatus('已加载全景预览，点击图片可在百度地图中继续查看。');
      image.onerror = () => setPanoramaStatus('暂未找到可用全景，建议打开站内地图或使用实时导航。');
      link.appendChild(image);
      elements.panoramaCanvas.appendChild(link);
    }).catch(() => setPanoramaStatus('暂未找到可用全景，建议打开站内地图或使用实时导航。'));
  }

  function loadCompleted() {
    try {
      return new Set(JSON.parse(window.localStorage.getItem('njtech-campus-tools-checklist-v1') || '[]'));
    } catch {
      return new Set();
    }
  }

  function persistCompleted() {
    try {
      window.localStorage.setItem('njtech-campus-tools-checklist-v1', JSON.stringify([...state.completed]));
    } catch {
      // The current-page checklist remains usable when storage is unavailable.
    }
  }

  function sourceBadge(record) {
    return '<span class="tool-source tool-source-' + escapeHtml(record.freshness) + '">' + escapeHtml(labels[record.freshness] || '资料参考') + '</span>';
  }

  function sourceDetail(record) {
    return '<p class="tool-card-source">来源：' + escapeHtml(record.sourceLabel) + ' · ' + escapeHtml(record.sourceYear) + '</p>';
  }

  function recordCard(record) {
    const actions = isPlaceRecord(record)
      ? '<div class="tool-card-actions"><a href="' + escapeHtml(safeToolUrl('campus-map.html?place=' + encodeURIComponent(String(record.id).replace(/^place-/, '')))) + '">查看地图</a><button type="button" data-panorama-query="' + escapeHtml(record.mapQuery) + '" data-panorama-title="' + escapeHtml(record.title) + '">查看全景</button><a href="' + escapeHtml(safeToolUrl(amapSearchUrl(record.mapQuery))) + '" target="_blank" rel="noreferrer">导航</a></div>'
      : '';
    const extra = record.sportCategory || record.placeCategory;
    return '<article class="tool-card"><div class="tool-card-head"><small class="tool-card-category">' + escapeHtml(record.category) + '</small>' + sourceBadge(record) + (extra ? '<small>' + escapeHtml(extra) + '</small>' : '') + '</div><h3>' + escapeHtml(record.title) + '</h3><p>' + escapeHtml(record.summary) + '</p>' + sourceDetail(record) + actions + '</article>';
  }

  function renderChecklist() {
    const items = filterRecords(data.checklist, state.query, state.category);
    elements.checklist.innerHTML = items.map((item) => '<label class="tool-check"><input type="checkbox" data-check-id="' + escapeHtml(item.id) + '"' + (state.completed.has(item.id) ? ' checked' : '') + '><span><strong>' + escapeHtml(item.title) + '</strong><small class="tool-check-category">分类：' + escapeHtml(item.category) + '</small><small>' + escapeHtml(item.summary) + '</small><small class="tool-check-source">来源：' + escapeHtml(item.sourceLabel) + ' · ' + escapeHtml(item.sourceYear) + '</small></span>' + sourceBadge(item) + '</label>').join('');
    elements.progress.textContent = state.completed.size + ' / ' + data.checklist.length;
  }

  function renderCollection(container, records) {
    const result = filterRecords(records, state.query, state.category);
    container.innerHTML = result.map(recordCard).join('');
    return result.length;
  }

  function render() {
    renderChecklist();
    const count = renderCollection(elements.life, data.lifeGuides)
      + renderCollection(elements.everyday, data.everydayGuides)
      + renderCollection(elements.sports, data.sports)
      + renderCollection(elements.places, data.places);
    const checks = filterRecords(data.checklist, state.query, state.category).length;
    const total = count + checks;
    elements.empty.hidden = total > 0;
    elements.resultStatus.textContent = total ? '已显示 ' + total + ' 项服务。' : '没有找到对应服务。';
    elements.filters.querySelectorAll('button').forEach((button) => {
      const active = button.dataset.toolFilter === state.category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  elements.search.addEventListener('input', () => {
    state.query = elements.search.value;
    render();
  });
  elements.filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tool-filter]');
    if (!button) return;
    state.category = button.dataset.toolFilter;
    render();
  });
  elements.reset?.addEventListener('click', () => {
    state.query = '';
    state.category = 'all';
    elements.search.value = '';
    render();
    elements.search.focus();
  });
  elements.checklist.addEventListener('change', (event) => {
    const input = event.target.closest('[data-check-id]');
    if (!input) return;
    if (input.checked) state.completed.add(input.dataset.checkId);
    else state.completed.delete(input.dataset.checkId);
    persistCompleted();
    render();
  });
  elements.places.addEventListener('click', (event) => {
    const button = event.target.closest('[data-panorama-query]');
    if (button) openPanorama(button.dataset.panoramaQuery, button.dataset.panoramaTitle);
  });
  elements.panoramaDialog?.addEventListener('click', (event) => {
    if (event.target === elements.panoramaDialog || event.target.closest('[data-panorama-close]')) closePanoramaDialog();
  });

  render();
}());
