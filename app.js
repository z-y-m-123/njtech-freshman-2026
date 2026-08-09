const libraryModal = document.querySelector('#libraryModal');
const toast = document.querySelector('#toast');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
let toastTimer;

const themeToggle = document.querySelector('[data-theme-toggle]');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('njtech-theme', theme); } catch (_) {}
  if (themeToggle) {
    const dark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? '切换为浅色' : '切换为深色');
    themeToggle.title = dark ? '切换为浅色' : '切换为深色';
  }
}
setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
themeToggle?.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

const onboarding = document.querySelector('#onboarding');
const onboardingKey = 'njtech-onboarding-v1';
function closeOnboarding() {
  if (!onboarding) return;
  onboarding.setAttribute('aria-hidden', 'true');
  try { localStorage.setItem(onboardingKey, 'seen'); } catch (_) {}
}
try {
  if (onboarding && !localStorage.getItem(onboardingKey)) {
    onboarding.setAttribute('aria-hidden', 'false');
  }
} catch (_) {}
document.querySelectorAll('[data-close-onboarding], [data-onboarding-choice]').forEach((node) => {
  node.addEventListener('click', closeOnboarding);
});

function setLibraryFilter(filter = 'all') {
  document.querySelectorAll('[data-library-filter]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.libraryFilter === filter);
  });
  document.querySelectorAll('[data-library-card]').forEach((card) => {
    const visible = filter === 'all' || card.dataset.libraryCard === filter;
    card.hidden = !visible;
  });
}

function openLibrary(filter = 'all') {
  setLibraryFilter(filter);
  libraryModal.classList.add('is-open');
  libraryModal.setAttribute('aria-hidden', 'false');
}

function closeLibrary() {
  libraryModal.classList.remove('is-open');
  libraryModal.setAttribute('aria-hidden', 'true');
}

function escapeHtml(value) {
  const container = document.createElement('div');
  container.textContent = value;
  return container.innerHTML;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

const freshmanDataUrl = 'data/freshman-data.json?v=20260723';
function renderClubDirectory(groups) {
  const container = document.querySelector('#clubDirectory');
  if (!container) return;
  container.innerHTML = groups.map((group, index) => {
    const clubs = group.clubs.map((name) => `<span>${escapeHtml(name)}</span>`).join('');
    return `<details ${index === 0 ? 'open' : ''}><summary>${escapeHtml(group.center)} · ${group.count}</summary><div class="club-list">${clubs}</div></details>`;
  }).join('');
}
async function loadFreshmanData() {
  const container = document.querySelector('#clubDirectory');
  if (!container) return;
  try {
    const response = await fetch(freshmanDataUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('读取数据失败');
    const data = await response.json();
    if (Array.isArray(data.clubs) && data.clubs.length) renderClubDirectory(data.clubs);
  } catch (error) {
    container.innerHTML = '<p class="club-loading">社团名单暂时加载失败，请稍后刷新页面再看。</p>';
  }
}
loadFreshmanData();

const transferHomeDataUrl = 'data/transfer-data.json?v=20260723-ordinary-only';
const transferHomeState = { data: null, grade: 'all', college: 'all', query: '' };
const transferHomeBody = document.querySelector('#transferHomeTableBody');
const transferHomeHead = document.querySelector('#transferHomeTableHead');
const transferHomeNote = document.querySelector('#transferHomeNote');
const transferHomeGrade = document.querySelector('#transferHomeGrade');
const transferHomeCollege = document.querySelector('#transferHomeCollege');
const transferHomeSearch = document.querySelector('#transferHomeSearch');

function setTransferHomeText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function fillTransferHomeSelect(select, values, label) {
  if (!select) return;
  select.innerHTML = `<option value="all">${label}</option>${values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`;
}

function getTransferHomeRecords() {
  if (!transferHomeState.data) return [];
  return transferHomeState.data.ordinary || [];
}

function syncTransferHomeFilters() {
  const records = getTransferHomeRecords();
  fillTransferHomeSelect(transferHomeGrade, [...new Set(records.map((item) => item.sourceGrade).filter(Boolean))].sort(), '全部年级');
  fillTransferHomeSelect(transferHomeCollege, [...new Set(records.map((item) => item.college).filter(Boolean))].sort(), '全部学院');
  transferHomeState.grade = 'all';
  transferHomeState.college = 'all';
}

function renderTransferHome() {
  if (!transferHomeBody || !transferHomeHead) return;
  const query = transferHomeState.query.trim().toLowerCase();
  const filtered = getTransferHomeRecords().filter((item) => {
    const gradeOk = transferHomeState.grade === 'all' || item.sourceGrade === transferHomeState.grade;
    const collegeOk = transferHomeState.college === 'all' || item.college === transferHomeState.college;
    const text = Object.values(item).join(' ').toLowerCase();
    return gradeOk && collegeOk && (!query || text.includes(query));
  });

  transferHomeHead.innerHTML = '<tr><th>学院</th><th>专业</th><th>年级</th><th>接收计划</th><th>第二志愿</th><th>先修课 / 笔试</th><th>联系</th></tr>';
  transferHomeBody.innerHTML = filtered.slice(0, 10).map((item) => `
    <tr>
      <td>${escapeHtml(item.college)}</td>
      <td>${escapeHtml(item.major)}</td>
      <td>${escapeHtml(item.sourceGrade)} → ${escapeHtml(item.targetGrade)}</td>
      <td>${escapeHtml(item.plan)}</td>
      <td>${escapeHtml(item.secondChoice)}</td>
      <td>${escapeHtml(item.prerequisite)} / ${escapeHtml(item.writtenSubject || '无')}</td>
      <td>${escapeHtml(item.contact || '—')}</td>
    </tr>
  `).join('');

  if (!filtered.length) {
    transferHomeBody.innerHTML = '<tr><td colspan="7">没有筛到结果，换个关键词或学院试试。</td></tr>';
  }
  if (transferHomeNote) transferHomeNote.textContent = `首页预览显示 ${Math.min(filtered.length, 10)} / ${filtered.length} 条普通本科生方案；更多备注、流程和资料分类请打开完整专题。`;
}

async function loadTransferHomeData() {
  if (!transferHomeBody) return;
  try {
    const response = await fetch(transferHomeDataUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('读取转专业数据失败');
    const buffer = await response.arrayBuffer();
    transferHomeState.data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
    setTransferHomeText('#transferHomeOrdinaryRecords', transferHomeState.data.summary.ordinary.records);
    setTransferHomeText('#transferHomeOrdinaryPlan', transferHomeState.data.summary.ordinary.planTotal);
    setTransferHomeText('#transferHomeWrittenCount', transferHomeState.data.summary.ordinary.writtenRequired);
    syncTransferHomeFilters();
    renderTransferHome();
  } catch (error) {
    transferHomeBody.innerHTML = '<tr><td>转专业资料加载失败，请刷新页面再试。</td></tr>';
  }
}

transferHomeGrade?.addEventListener('change', () => { transferHomeState.grade = transferHomeGrade.value; renderTransferHome(); });
transferHomeCollege?.addEventListener('change', () => { transferHomeState.college = transferHomeCollege.value; renderTransferHome(); });
transferHomeSearch?.addEventListener('input', () => { transferHomeState.query = transferHomeSearch.value; renderTransferHome(); });
loadTransferHomeData();

document.querySelectorAll('[data-open-library]').forEach((button) => button.addEventListener('click', () => openLibrary(button.dataset.libraryJump || 'all')));
document.querySelectorAll('[data-close-library]').forEach((button) => button.addEventListener('click', closeLibrary));
document.querySelectorAll('[data-library-filter]').forEach((button) => button.addEventListener('click', () => setLibraryFilter(button.dataset.libraryFilter)));
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast)));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeLibrary();
  if (typeof closeCampusMap === 'function') closeCampusMap();
  if (typeof closeAcademicHub === 'function') closeAcademicHub();
});

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  header.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const checks = [...document.querySelectorAll('#checklist input')];
const count = document.querySelector('#checkCount');
const ring = document.querySelector('#ringValue');
function updateProgress() {
  const completed = checks.filter((check) => check.checked).length;
  count.textContent = completed;
  ring.setAttribute('stroke-dasharray', `${completed * 25}, 100`);
}
checks.forEach((check) => check.addEventListener('change', updateProgress));
updateProgress();

const routeData = {
  station: {
    title: '南京站 → 安德门 → 南京工业大学站',
    mode: '地铁 1 号线 + 10 号线参考',
    text: '可优先查询地铁 1 号线在安德门换乘 10 号线的实时方案；抵达南京工业大学站后，再按当年报到点和校内指引前往。'
  },
  south: {
    title: '南京南站 → 安德门 → 南京工业大学站',
    mode: '地铁 1 号线 + 10 号线参考',
    text: '可优先查询地铁 1 号线在安德门换乘 10 号线的实时方案；南京南站客流较大，请为换乘与寻找报到入口预留时间。'
  },
  airport: {
    title: '禄口机场 → 南京南站 → 安德门 → 南京工业大学站',
    mode: 'S1 机场线 + 地铁参考',
    text: '可优先查询 S1 机场线到南京南站、再经 1 号线和 10 号线的实时方案；如携带大件行李，也可比较实时公共交通与网约车路线。'
  }
};

const routeTabs = [...document.querySelectorAll('.route-tab')];
const routeDetail = document.querySelector('#routeDetail');
routeTabs.forEach((tab) => tab.addEventListener('click', () => {
  const route = routeData[tab.dataset.route];
  routeTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  routeDetail.innerHTML = `<span class="route-mode">${route.mode}</span><h3>${route.title}</h3><p>${route.text}</p>`;
}));

const campusMapModal = document.querySelector('#campusMapModal');
const mapViewport = document.querySelector('#campusMapViewport');
const mapStage = document.querySelector('#campusMapStage');
const dormLayer = document.querySelector('#dormLayer');
const serviceLayer = document.querySelector('#serviceLayer');
const dormInfoPanel = document.querySelector('#dormInfoPanel');
const dormLayerToggle = document.querySelector('[data-toggle-dorm-layer]');
const serviceLayerToggle = document.querySelector('[data-toggle-service-layer]');
const dormPins = [...document.querySelectorAll('[data-dorm-id]')];
const servicePins = [...document.querySelectorAll('[data-service-id]')];
let mapScale = 1;
let mapX = 0;
let mapY = 0;
let dragStart = null;

function renderCampusMap() {
  mapStage.style.transform = `translate(calc(-50% + ${mapX}px), calc(-50% + ${mapY}px)) scale(${mapScale})`;
}

function resetCampusMap() {
  mapScale = 1;
  mapX = 0;
  mapY = 0;
  renderCampusMap();
}

function openCampusMap() {
  campusMapModal.classList.add('is-open');
  campusMapModal.setAttribute('aria-hidden', 'false');
  resetCampusMap();
}

function closeCampusMap() {
  campusMapModal.classList.remove('is-open');
  campusMapModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-open-campus-map]').forEach((button) => button.addEventListener('click', openCampusMap));
document.querySelectorAll('[data-close-campus-map]').forEach((button) => button.addEventListener('click', closeCampusMap));
document.querySelectorAll('[data-map-zoom]').forEach((button) => button.addEventListener('click', () => {
  const direction = button.dataset.mapZoom === 'in' ? 0.2 : -0.2;
  mapScale = Math.min(3.2, Math.max(0.65, mapScale + direction));
  renderCampusMap();
}));
document.querySelector('[data-map-reset]').addEventListener('click', resetCampusMap);

const academicModal = document.querySelector('#academicModal');
function openAcademicHub() {
  academicModal.classList.add('is-open');
  academicModal.setAttribute('aria-hidden', 'false');
}
function closeAcademicHub() {
  academicModal.classList.remove('is-open');
  academicModal.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('[data-open-academic-hub]').forEach((button) => button.addEventListener('click', openAcademicHub));
document.querySelectorAll('[data-close-academic-hub]').forEach((button) => button.addEventListener('click', closeAcademicHub));

document.querySelectorAll('[data-split-text]').forEach((element) => {
  const text = element.textContent.trim();
  element.setAttribute('aria-label', text);
  element.innerHTML = [...text].map((character, index) => `<span aria-hidden="true" style="--delay:${index * 34}ms">${character === ' ' ? '&nbsp;' : character}</span>`).join('');
});

const revealTargets = document.querySelectorAll('main > .section, .resource-banner');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => {
    if (!target.classList.contains('hero')) revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-revealed'));
}

const wallModal = document.querySelector('#messageWallModal');
const wallForm = document.querySelector('#messageWallForm');
const wallBoard = document.querySelector('#messageWall');
const wallMessage = document.querySelector('#wallMessage');
const wallCount = document.querySelector('#wallMessageCount');
const defaultWallEndpoint = 'https://lmlunnluyjzxferfzynp.supabase.co/functions/v1/message-wall';
const wallEndpoint = window.NJTECH_SITE_CONFIG?.messageWallEndpoint || defaultWallEndpoint;
const messageWallEnabled = window.NJTECH_SITE_CONFIG?.messageWallEnabled === true;
const wallPostedKey = 'njtech-message-wall-posted-v2';
const wallDeviceKey = 'njtech-message-wall-device-v2';
const blockedWords = ['傻逼', '垃圾', '去死', '造谣', '诋毁', '色情', '裸聊', '恶心', '骗子'];
const homepageFeaturedMessage = {
  nickname: '南工起点站',
  grade: '2026 级 · 首页精选',
  content: '欢迎新同学来到南工大，愿你开学第一天就遇见好天气。',
  featured: true
};
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
function getWallDeviceId() {
  let deviceId = localStorage.getItem(wallDeviceKey);
  if (!deviceId) {
    if (window.crypto?.getRandomValues) {
      deviceId = Array.from(crypto.getRandomValues(new Uint8Array(24)), (byte) => byte.toString(16).padStart(2, '0')).join('');
    } else {
      deviceId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    localStorage.setItem(wallDeviceKey, deviceId);
  }
  return deviceId;
}
function hasPostedWallMessage() { return localStorage.getItem(wallPostedKey) === 'true'; }
function clearWallNotes() {
  wallBoard.querySelectorAll('.wall-note').forEach((item) => item.remove());
}
function drawWallStatus(message, detail = '', retry = false) {
  clearWallNotes();
  const note = document.createElement('article');
  note.className = 'wall-note wall-note-1 wall-note-status';
  note.innerHTML = `<span>✦</span><p>${escapeHtml(message)}</p>${detail ? `<small>${escapeHtml(detail)}</small>` : ''}${retry ? '<button class="wall-retry" type="button">重试</button>' : ''}`;
  wallBoard.append(note);
  note.querySelector('.wall-retry')?.addEventListener('click', renderWall);
}
function drawWall(entries) {
  clearWallNotes();
  if (!entries.length) {
    const empty = document.createElement('article');
    empty.className = 'wall-note wall-note-1';
    empty.innerHTML = '<span>✦</span><p>第一句，等你写下。</p><small>欢迎来到南工起点站</small>';
    wallBoard.append(empty);
    return;
  }
  entries.forEach((entry, index) => {
    const note = document.createElement('article');
    note.className = `wall-note wall-note-${index + 1}${entry.featured ? ' wall-note-featured' : ''}`;
    note.innerHTML = `<span>${escapeHtml(entry.nickname.slice(0, 1))}</span><p>${escapeHtml(entry.content)}</p><small>${escapeHtml(entry.grade)}</small>`;
    wallBoard.append(note);
  });
}
async function renderWall() {
  drawWallStatus('正在同步留言墙…', '网络慢一点也没关系');
  try {
    const response = await fetchWithTimeout(wallEndpoint, { headers: { Accept: 'application/json' } });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || '读取失败');
    const latestMessages = (payload.messages || []).filter((entry) => (
      entry.nickname !== homepageFeaturedMessage.nickname
      && entry.content !== '人生亦有命'
    ));
    drawWall([homepageFeaturedMessage, ...latestMessages].slice(0, 3));
  } catch (error) {
    drawWallStatus('留言墙暂时没连上', error.name === 'AbortError' ? '网络超时，点一下再试试' : '可能是网络波动，刷新或重试即可', true);
  }
}
function openWallModal() {
  if (!messageWallEnabled) { showToast('留言功能暂未开放，历史内容仍会保留。'); return; }
  if (hasPostedWallMessage()) { showToast('你已经留过一条留言啦，感谢你的分享。'); return; }
  wallModal.classList.add('is-open');
  wallModal.setAttribute('aria-hidden', 'false');
}
function closeWallModal() { wallModal.classList.remove('is-open'); wallModal.setAttribute('aria-hidden', 'true'); }
document.querySelectorAll('[data-open-message-wall]').forEach((button) => {
  if (!messageWallEnabled) {
    button.setAttribute('aria-disabled', 'true');
    button.classList.add('is-disabled');
    button.textContent = '留言功能暂未开放';
  } else {
    button.addEventListener('click', openWallModal);
  }
});
document.querySelectorAll('[data-close-message-wall]').forEach((button) => button.addEventListener('click', closeWallModal));
if (messageWallEnabled) wallMessage.addEventListener('input', () => { wallCount.textContent = wallMessage.value.length; });
if (messageWallEnabled) wallForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nickname = document.querySelector('#wallNickname').value.trim();
  const grade = document.querySelector('#wallGrade').value.trim();
  const message = wallMessage.value.trim();
  const text = `${nickname}${grade}${message}`.toLowerCase();
  if (nickname.length < 2 || grade.length < 2 || message.length < 4) return showToast('请完整填写昵称、年级和至少 4 个字的留言。');
  if (blockedWords.some((word) => text.includes(word))) return showToast('留言未通过内容审核，请修改后再试。');
  const submitButton = wallForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    const response = await fetchWithTimeout(wallEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-device-id': getWallDeviceId() },
      body: JSON.stringify({ nickname, grade, content: message })
    }, 10000);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || '发布失败，请稍后重试。');
    localStorage.setItem(wallPostedKey, 'true');
    wallForm.reset(); wallCount.textContent = '0'; closeWallModal(); await renderWall(); showToast('留言已发布，其他同学现在也能看见。');
  } catch (error) {
    showToast(error.message || '发布失败，请稍后重试。');
  } finally {
    submitButton.disabled = false;
  }
});
if (messageWallEnabled) {
  renderWall();
} else if (wallBoard) {
  drawWallStatus('留言功能暂未开放', '为节省资源，暂时关闭发布和读取；历史数据不会删除。');
}

const dormData = {
  'new-nanyuan': { name: '新南苑（11、12 栋）', tags: ['11 层', '电梯', '四人间', '上床下桌', '套间式'], text: '新南苑宿舍楼共 11 层，配备电梯，可欣赏江景。宿舍为四人间、上床下桌，整体布局与老南苑相似，为套间式结构，共用厕所和浴室；楼内配有洗衣机，热水可到一楼使用。楼下还设有篮球场和乒乓球桌。' },
  'old-nanyuan': { name: '老南苑（底图可见 1–10 栋）', tags: ['1–4 栋', '四人间', '上床下桌', '套间大厅', '近食堂快递'], text: '南苑 1 至 4 栋被称为老南苑，宿舍为四人间、上床下桌。每个套间内有三间宿舍，共用一个宽敞大厅，设有电热水器和坑位。通过南苑小道可较方便领取中通、申通、圆通、京东等快递；新老南苑之间有南苑食堂和浦园食堂，吃饭和出行都比较方便。' },
  yaqing: { name: '亚青村', tags: ['现代化', '四人间', '23–25 栋独卫', '近操场球场'], text: '亚青村是近几年新建的宿舍区，设施较新。室外为走廊式布局，洗衣机和打水点通常在每栋楼底；室内多为上床下桌四人间，有阳台、有空调。亚青 23–25 栋较特殊，卫浴分开，四人间没有大厅，洗漱池在卫生间外且有热水。宿舍旁有田径场和篮球场，运动比较方便。' },
  xiangshan: { name: '象山苑', tags: ['男生宿舍', '四/六人间', '上床下桌', '近公交站'], text: '象山宿舍区坐落于老山北麓、镜湖南畔，环境有山水感。宿舍提供四人间和六人间，采用上床下桌布局；除 17、18 栋为六人间外，其余楼栋多为四人间。每栋楼内有四个四人间共享一个大厅，阳台则为每个宿舍独享。宿舍区内有荷花小池塘，出门即公交站，交通较方便。' },
  tanxiang: { name: '檀香苑', tags: ['女生宿舍', '依山而建', '四人间为主', '11 栋六人间'], text: '檀香宿舍位于南工山上，是女生宿舍区，环境较好。除檀香 11 栋为六人间外，其他宿舍多为标准四人间，采用上床下桌布局。室外通常为四个寝室共用一个大厅，卫生间在室外；室内多有小阳台和空调。檀香邻近同和、仁智等教学楼，适合学习和自习。' },
  dongyuan: { name: '东苑', tags: ['小公寓风格', '四人间', '上床下桌', '大阳台', '近快递篮球场'], text: '东苑以小公寓式设计闻名，每个单元包含一个宽敞大厅和四间独立房间。它位于江浦校区较热闹、出行方便的地段，宿舍内为上床下桌四人间，据说还有较大的阳台。位置靠近篮球场和快递中心，日常生活便利。' },
  xiyuan: { name: '西苑', tags: ['四人间', '上床下桌', '露天阳台', '近西苑食堂'], text: '西苑环境较好，距离教学楼和餐厅都比较近。宿舍多为上床下桌四人间，每个宿舍配有阳台，而且是露天大阳台。四个宿舍共用一个宽敞洗漱间，浴室和厕所通过隔板分隔；宿舍门口就是西苑食堂，吃饭很方便。' }
};

const dormPhotos = {
  'old-nanyuan': ['old-nanyuan-01.webp', 'old-nanyuan-02.webp', 'old-nanyuan-03.webp', 'old-nanyuan-04.webp', 'old-nanyuan-05.webp'],
  yaqing: ['yaqing-01.webp', 'yaqing-02.webp', 'yaqing-03.webp', 'yaqing-04.webp'],
  xiangshan: ['xiangshan-01.webp', 'xiangshan-02.webp', 'xiangshan-03.webp', 'xiangshan-04.webp', 'xiangshan-05.webp', 'xiangshan-06.webp'],
  tanxiang: ['tanxiang-01.webp', 'tanxiang-02.webp', 'tanxiang-03.webp', 'tanxiang-04.webp'],
  dongyuan: ['dongyuan-01.webp', 'dongyuan-02.webp', 'dongyuan-03.webp', 'dongyuan-04.webp', 'dongyuan-05.webp', 'dongyuan-06.webp', 'dongyuan-07.webp'],
  xiyuan: ['xiyuan-01.webp', 'xiyuan-02.webp', 'xiyuan-03.webp', 'xiyuan-04.webp']
};

function dormPreviewHtml(id, name) {
  const photos = dormPhotos[id] || [];
  if (!photos.length) return '';
  return `<div class="dorm-photo-preview dorm-photo-cta" aria-label="${name}宿舍图片入口">
    <span>宿舍实拍图鉴</span>
    <strong>${photos.length} 张图片</strong>
    <button type="button" data-open-dorm-gallery="${id}" onpointerdown="event.stopPropagation()" onclick="window.NJTECH_OPEN_DORM_GALLERY && window.NJTECH_OPEN_DORM_GALLERY('${id}')">点击查看全部图片</button>
  </div>`;
}

function ensureDormGalleryModal() {
  let modal = document.querySelector('#dormGalleryModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.className = 'dorm-gallery-modal';
  modal.id = 'dormGalleryModal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `<div class="dorm-gallery-backdrop" data-close-dorm-gallery></div>
    <section class="dorm-gallery-card" role="dialog" aria-modal="true" aria-labelledby="dormGalleryTitle">
      <button class="modal-close dorm-gallery-close" type="button" aria-label="关闭宿舍相册" data-close-dorm-gallery>×</button>
      <div class="dorm-gallery-head">
        <p>宿舍实拍图鉴</p>
        <h2 id="dormGalleryTitle">宿舍图片</h2>
        <span id="dormGalleryCount"></span>
      </div>
      <div class="dorm-gallery-grid" id="dormGalleryGrid"></div>
    </section>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-dorm-gallery]')) closeDormGallery();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeDormGallery();
  });
  return modal;
}

function openDormGallery(id) {
  const dorm = dormData[id];
  const photos = dormPhotos[id] || [];
  if (!dorm || !photos.length) return;
  const modal = ensureDormGalleryModal();
  modal.querySelector('#dormGalleryTitle').textContent = dorm.name;
  modal.querySelector('#dormGalleryCount').textContent = `${photos.length} 张图片`;
  modal.querySelector('#dormGalleryGrid').innerHTML = photos.map((file, index) => {
    const src = `assets/dorm-gallery/${file}`;
    return `<a href="${src}" target="_blank" rel="noreferrer"><img src="${src}" alt="${dorm.name}宿舍实拍 ${index + 1}" loading="lazy" /></a>`;
  }).join('');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

window.NJTECH_OPEN_DORM_GALLERY = openDormGallery;

function closeDormGallery() {
  const modal = document.querySelector('#dormGalleryModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function showDormInfo(id) {
  const dorm = dormData[id];
  if (!dorm) return;
  dormPins.forEach((pin) => pin.classList.toggle('is-selected', pin.dataset.dormId === id));
  dormInfoPanel.innerHTML = `<p class="dorm-panel-kicker">图片介绍已转文字 · 宿舍区参考</p><h3>${dorm.name}</h3><div class="dorm-tags">${dorm.tags.map((tag) => `<span>${tag}</span>`).join('')}</div><p>${dorm.text}</p>${dormPreviewHtml(id, dorm.name)}<p class="dorm-note">照片为资料整理参考，最终宿舍、床位和设施以学校实际分配及现场情况为准。</p>`;
  dormInfoPanel.querySelector('[data-open-dorm-gallery]')?.addEventListener('click', (event) => {
    event.stopPropagation();
    openDormGallery(id);
  });
}

dormLayerToggle.addEventListener('click', () => {
  const visible = dormLayer.classList.toggle('is-visible');
  dormLayerToggle.classList.toggle('is-active', visible);
  dormLayerToggle.setAttribute('aria-pressed', String(visible));
  if (visible) showDormInfo('old-nanyuan');
});

dormPins.forEach((pin) => {
  pin.addEventListener('pointerdown', (event) => event.stopPropagation());
  pin.addEventListener('click', () => showDormInfo(pin.dataset.dormId));
});

dormInfoPanel.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open-dorm-gallery]');
  if (!trigger) return;
  event.stopPropagation();
  openDormGallery(trigger.dataset.openDormGallery);
});

// The information panel sits on top of the draggable map. Keep its controls
// out of the map's pointer-capture flow so buttons remain clickable on touch devices.
dormInfoPanel.addEventListener('pointerdown', (event) => event.stopPropagation());
dormInfoPanel.addEventListener('pointerup', (event) => event.stopPropagation());

// Capture the gallery action before map handlers or legacy listeners can consume it.
document.addEventListener('click', (event) => {
  const trigger = event.target.closest?.('[data-open-dorm-gallery]');
  if (!trigger) return;
  event.preventDefault();
  event.stopPropagation();
  openDormGallery(trigger.dataset.openDormGallery);
}, true);

const serviceData = {
  'north-gate': { name: '北门', type: '校门', text: '原图标注为“North Gate / 北门”。' },
  'west-gate': { name: '西门', type: '校门', text: '原图标注为“West Gate / 西门”。' },
  'south-gate': { name: '南门', type: '校门', text: '原图标注为“South Gate / 南门”。' },
  'health-center': { name: '校医院', type: '医疗服务', text: '原图标注为“校医院 / Health Center”。就诊安排以校医院当日公示为准。' },
  'yaqing-canteen': { name: '亚青食堂', type: '餐饮服务', text: '原图标注为“亚青食堂 / Yaqing Canteen”。营业时间以现场为准。' },
  'xiangshan-canteen': { name: '象山食堂', type: '餐饮服务', text: '原图标注为“象山食堂 / Xiangshan Canteen”。营业时间以现场为准。' },
  'nanyuan-canteen': { name: '南苑食堂', type: '餐饮服务', text: '原图标注为“南苑食堂 / Nanyuan Canteen”。营业时间以现场为准。' },
  'jingxing-canteen': { name: '景星苑食堂', type: '餐饮服务', text: '原图标注为“景星苑食堂 / Jingxingyuan Canteen”。营业时间以现场为准。' },
  'xiyuan-canteen': { name: '西苑食堂', type: '餐饮服务', text: '原图标注为“西苑食堂 / Xiyuan Canteen”。营业时间以现场为准。' },
  'dongyuan-canteen': { name: '东苑食堂', type: '餐饮服务', text: '原图标注为“东苑食堂 / Dongyuan Canteen”。营业时间以现场为准。' }
};

function showServiceInfo(id) {
  const service = serviceData[id];
  if (!service) return;
  servicePins.forEach((pin) => pin.classList.toggle('is-selected', pin.dataset.serviceId === id));
  dormInfoPanel.innerHTML = `<p class="dorm-panel-kicker">高清地图原图标注 · ${service.type}</p><h3>${service.name}</h3><p>${service.text}</p>`;
}

serviceLayerToggle.addEventListener('click', () => {
  const visible = serviceLayer.classList.toggle('is-visible');
  serviceLayerToggle.classList.toggle('is-active', visible);
  serviceLayerToggle.setAttribute('aria-pressed', String(visible));
  if (visible) showServiceInfo('health-center');
});

servicePins.forEach((pin) => {
  pin.addEventListener('pointerdown', (event) => event.stopPropagation());
  pin.addEventListener('click', () => showServiceInfo(pin.dataset.serviceId));
});

mapViewport.addEventListener('wheel', (event) => {
  event.preventDefault();
  mapScale = Math.min(3.2, Math.max(0.65, mapScale + (event.deltaY < 0 ? 0.15 : -0.15)));
  renderCampusMap();
}, { passive: false });

function stopMapDrag() {
  dragStart = null;
  mapViewport.classList.remove('is-dragging');
}

mapViewport.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.target.closest('button, a, .dorm-info-panel')) return;
  dragStart = { x: event.clientX, y: event.clientY, mapX, mapY };
  mapViewport.classList.add('is-dragging');
  mapViewport.setPointerCapture(event.pointerId);
});
mapViewport.addEventListener('pointermove', (event) => {
  if (!dragStart) return;
  mapX = dragStart.mapX + event.clientX - dragStart.x;
  mapY = dragStart.mapY + event.clientY - dragStart.y;
  renderCampusMap();
});
mapViewport.addEventListener('pointerup', stopMapDrag);
mapViewport.addEventListener('pointercancel', stopMapDrag);
mapViewport.addEventListener('lostpointercapture', stopMapDrag);
