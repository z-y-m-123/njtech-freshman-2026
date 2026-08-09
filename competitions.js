const searchInput = document.querySelector('#competitionSearch');
const levelFilters = document.querySelector('#competitionLevelFilters');
const collegeSelect = document.querySelector('#competitionCollege');
const count = document.querySelector('#competitionCount');
const list = document.querySelector('#competitionList');
const loadMore = document.querySelector('#competitionLoadMore');
const modal = document.querySelector('#competitionModal');
const modalLevel = document.querySelector('#competitionModalLevel');
const modalTitle = document.querySelector('#competitionModalTitle');
const modalDetails = document.querySelector('#competitionModalDetails');
const pageSize = 24;
let records = [];
let selectedLevel = 'all';
let visibleCount = pageSize;

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

function filterRecords() {
  const term = searchInput.value.trim().toLowerCase();
  const college = collegeSelect.value;
  return records.filter((item) => {
    const levelMatch = selectedLevel === 'all' || item.nationalLevel === selectedLevel;
    const collegeMatch = college === 'all' || item.department === college;
    const haystack = [item.name, item.department, item.organizer, item.provincialName].join(' ').toLowerCase();
    return levelMatch && collegeMatch && (!term || haystack.includes(term));
  });
}

function render() {
  const filtered = filterRecords();
  const visible = filtered.slice(0, visibleCount);
  count.textContent = filtered.length;
  list.innerHTML = visible.map((item, index) => `<article class="competition-item"><span class="competition-item-index">${String(index + 1).padStart(2, '0')}</span><div><div class="competition-item-meta"><b>${escapeHtml(item.nationalLevel)}</b>${item.provincialLevel && item.provincialLevel !== '/' ? `<span>${escapeHtml(item.provincialLevel)}</span>` : ''}</div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.department || '牵头单位以目录为准')}</p></div><button type="button" data-competition-id="${item.id}" aria-label="查看${escapeHtml(item.name)}详情">详情 ↗</button></article>`).join('') || '<p class="competition-empty">没有找到匹配的赛事，换个关键词或筛选条件试试。</p>';
  loadMore.hidden = visible.length >= filtered.length;
  list.querySelectorAll('[data-competition-id]').forEach((button) => button.addEventListener('click', () => openDetail(Number(button.dataset.competitionId))));
}

function openDetail(id) {
  const item = records.find((entry) => entry.id === id);
  if (!item) return;
  modalLevel.textContent = [item.nationalLevel, item.provincialLevel !== '/' ? item.provincialLevel : ''].filter(Boolean).join(' · ');
  modalTitle.textContent = item.name;
  const details = [
    ['牵头单位', item.department || '以目录为准'],
    ['主办单位', item.organizer],
    ['省赛名称', item.provincialName !== '/' ? item.provincialName : '未列出'],
    ['备注', item.note]
  ].filter(([, value]) => value);
  modalDetails.innerHTML = details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
}

function renderFilters() {
  const levels = ['all', '国家A类', '国家B1类', '国家B2类', '国家B3类', '国家C类'];
  levelFilters.innerHTML = levels.map((level) => `<button class="${level === selectedLevel ? 'is-active' : ''}" type="button" data-level="${level}">${level === 'all' ? '全部等级' : level}</button>`).join('');
  levelFilters.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { selectedLevel = button.dataset.level; visibleCount = pageSize; renderFilters(); render(); }));
}

async function init() {
  try {
    const response = await fetch('data/competitions-2024.json');
    const payload = await response.json();
    records = payload.records || [];
    [...new Set(records.map((item) => item.department).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh-CN')).forEach((department) => {
      const option = document.createElement('option'); option.value = department; option.textContent = department; collegeSelect.append(option);
    });
    renderFilters(); render();
  } catch (error) {
    list.innerHTML = '<p class="competition-empty">目录暂时无法加载，请稍后刷新页面再试。</p>';
  }
}

searchInput.addEventListener('input', () => { visibleCount = pageSize; render(); });
collegeSelect.addEventListener('change', () => { visibleCount = pageSize; render(); });
loadMore.addEventListener('click', () => { visibleCount += pageSize; render(); });
document.querySelectorAll('[data-close-competition]').forEach((button) => button.addEventListener('click', () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); }));
init();
