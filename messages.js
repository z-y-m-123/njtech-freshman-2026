const board = document.querySelector('#messagesBoard');
const status = document.querySelector('#messagesStatus');
const loadMoreButton = document.querySelector('#messagesLoadMore');
const fallbackEndpoint = 'https://lmlunnluyjzxferfzynp.supabase.co/functions/v1/message-wall';
const endpoint = window.NJTECH_SITE_CONFIG?.messageWallEndpoint || fallbackEndpoint;
const messageWallEnabled = window.NJTECH_SITE_CONFIG?.messageWallEnabled === true;
const pageSize = 18;
let nextOffset = 0;
let hasMore = false;
let isLoading = false;

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[character]));
}

function createCard(entry, index) {
  const card = document.createElement('article');
  card.className = 'message-card';
  card.style.setProperty('--delay', `${Math.min(index, 10) * 35}ms`);
  card.innerHTML = `<span class="message-card-avatar">${escapeHtml(String(entry.nickname || '').slice(0, 1) || '南')}</span><p>${escapeHtml(entry.content)}</p><small>${escapeHtml(entry.nickname)} · ${escapeHtml(entry.grade)}</small>`;
  return card;
}

function drawEmpty() {
  board.innerHTML = '<article class="messages-empty"><span>✦</span><p>第一句，等你写下。</p><a href="index.html#community">回到首页留言 ↗</a></article>';
}

async function loadMessages(reset = false) {
  if (isLoading) return;
  isLoading = true;
  if (reset) {
    nextOffset = 0;
    board.replaceChildren();
  }
  status.textContent = reset ? '正在加载留言…' : '正在加载更多留言…';
  loadMoreButton.hidden = true;

  try {
    const url = new URL(endpoint);
    url.searchParams.set('limit', String(pageSize));
    url.searchParams.set('offset', String(nextOffset));
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || '读取失败');

    const messages = payload.messages || [];
    if (reset && !messages.length) drawEmpty();
    const startIndex = board.children.length;
    messages.forEach((entry, index) => board.append(createCard(entry, startIndex + index)));
    nextOffset = Number.isFinite(payload.nextOffset) ? payload.nextOffset : nextOffset + messages.length;
    hasMore = Boolean(payload.hasMore);
    status.textContent = messages.length ? (hasMore ? '继续向下看看更多同学的留言。' : '已经看到目前全部留言。') : '暂时没有更多留言。';
    loadMoreButton.hidden = !hasMore;
  } catch (error) {
    status.textContent = '留言墙暂时没连上，请稍后再试。';
    loadMoreButton.hidden = false;
    loadMoreButton.textContent = '重新加载';
  } finally {
    isLoading = false;
  }
}

if (messageWallEnabled) {
  loadMoreButton.addEventListener('click', () => loadMessages(false));
  loadMessages(true);
} else {
  board.innerHTML = '<article class="messages-empty"><span>✦</span><p>留言功能暂未开放。</p><small>为节省运行资源，发布和读取暂时关闭；历史数据会保留。</small></article>';
  status.textContent = '留言功能暂未开放';
  loadMoreButton.hidden = true;
}
