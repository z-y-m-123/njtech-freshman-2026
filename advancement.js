const advancementSearch = document.querySelector('#advancementSearch');
const advancementList = document.querySelector('#advancementList');
const visibleCount = document.querySelector('#visibleCount');
const recordCount = document.querySelector('#recordCount');
let advancementRecords = [];
let selectedYear = '2026';
const official2025Covers = [
['化工学院','MrDbYeVEKt6lVUVmp2Jy5gibITP7oXYGUcGfdIwQFOmGlPKyeCj4DDtpKOl6Z21icwrgWVPZT4vgeAl0HE7Bc74Q'],['安全科学与工程学院','MrDbYeVEKt7H8YAY4jDk6YpMXfaC6oIy9UsVM7n4Ol29ibI1PMvOGLej93YhUcurz6VUJYFhrwesuRb7NXuX05w'],['机械与动力工程学院','MrDbYeVEKt4PYSmEgqRekRDRukOdf7P8fDW2CicK7DQDvN9sWkZGWBibGvMhpQ7nE4icZylOwlDrG6ItvKFZS50mQ'],['城市建设学院','MrDbYeVEKt5x6iaxlRL2YJkkvr2xllibKuCF962ZHUtkWlBem94rde1EnEo758JqtZY4IB1gBU0pxFuF7P2ffic0g'],['化学与分子工程学院','MrDbYeVEKt59peFRVuqsuZSbMOQJRJibcK1QKh6klLBZEhAgNZmc50w64RJiaF4kVMabeXMW6oXNhBQfywDKAiaXA'],['材料科学与工程学院','MrDbYeVEKt7380oXo35SkkQ7kZ1ozdiboYPFtibISbPdoOqAAbhafdWJUcsM9p0KN9ASKtdDIEVRMa7DVDfiacs3w'],['生物与制药工程学院','MrDbYeVEKt72YS5JyibeYoGQsRKpIF2AfnPDVfkevG0HvPRSkrykwETVPRW08AKicn7rBPZ4BucsDglEjXs02t5A'],['电气工程与控制科学学院','MrDbYeVEKt5NUKbQTZic27lnPl8WvEWNbnSRdTdoCwLwb7FHNaBnwyeHFrx28kvQPrpLYJGSqWptJy4ZF3bVGUg'],['能源科学与工程学院','MrDbYeVEKt6iakSmRxwfWRibLnEdibeZ3DcGgxxMYjtO2wYZmicNeefZBx5cgcVfYblnSahFJBeql3dvN7wRXwkMqA'],['计算机与信息工程学院（人工智能学院）','MrDbYeVEKt7tMTPPKjW3licwxHvVAFBoibrD9m197jfaktpCN1qicRjlQjKnZhtEwRJv06pDw1e6vWFldO7lClF4w'],['经济与管理学院','MrDbYeVEKt6iakSmRxwfWRibLnEdibeZ3DcnePWEhVgLAcfMndwhDMMhvFAyBzlHQT8ckAnnPzrNaibwTBWRnQIOWw'],['环境科学与工程学院','MrDbYeVEKt4YNLYYl1nsIowKrBkQNX5brb3bAS0lMECIXdCQhqSpdYdXf0iaYIzvvN2VxTic7dMsMytLaM6bKfaw'],['交通运输工程学院','MrDbYeVEKt5GVO0ETyYkClYPlpkYQEeL7aVHdGCfDsosvIafbybcrZltZC2fmdZrYsGtRRg6gibpXp8NubibKOdQ'],['2011 学院','MrDbYeVEKt7CFp295RBTTKfjLBjsZEgOHS3k4YrNDllgdrHGQl9646X8ZqXoosfSBNcF7YKlL5avlCPPQcRrqA'],['建筑学院','MrDbYeVEKt7CFp295RBTTKfjLBjsZEgOqQqZ3RZzGOIahsaZFruAfktQdM8VkyKbzc1iahkcKfZLX8X3u2h4KxA'],['食品与轻工学院','MrDbYeVEKt43aoePXsSTEomjTM4iaW2Mhy8AjTE2DTrjcCeQtVCGoFoPdmicmSlX29bqAIt6BrotXjB0QTOTicD7Q'],['外国语言文学学院','MrDbYeVEKt4qtRkgJut2ud9WeaSVqqAtVyew7frp3gsXD4qHTQWOpjGLp236PvAhC2ic7S3M9PlGHLeicrt7tpcQ'],['药学院','MrDbYeVEKt7CFp295RBTTKfjLBjsZEgOCUGFjfbvO3DgrFfSrk5la9It5KicibHk8bczBDUn9ib5R3lIgPtXib6ecw'],['数理科学学院','MrDbYeVEKt639bMuXriagF299o3NBlAAF6QIUTehEzmz0qpYlznuZUZTJOtUTREpzUL0DkyT9hqTUJicegO6JGlQ'],['测绘科学与技术学院','MrDbYeVEKt7CFp295RBTTKfjLBjsZEgObhp6XoflF9rjosnGlP93VXRxzW9XAeBibVL90hiaWlOguEGl2PYkWiaYg'],['法政学院','MrDbYeVEKt7CFp295RBTTKfjLBjsZEgOXQWhMPdUSgibhP6HbvU2Jz9altaxqF6ab923bicpYNAYQD7wuFhBUkQA'],['土木工程学院','MrDbYeVEKt6VWoTYyXgUn635WY9Qd4icrmd9mNBH2DSoF7Amicia7pzYStM2B5icHSkT5XibUgYKpgCCRr2JibLW4zlw'],['艺术设计学院','MrDbYeVEKt51JeibGRj92YJVn6bfcZwXvxwLVdCqv7KUhcIxJ4GtBFeJYP2BFRCIQXjPiaMcGBJRZIf8wzIOPetA']
].map(([college,imageId])=>({year:2025,college,title:'本科生升学荣誉榜',metrics:[],summary:'南京工业大学学工在线发布的 2025 届本科生升学荣誉榜。',source:'南京工业大学学工在线 · 升学深造专辑',cover:`https://mmbiz.qpic.cn/sz_mmbiz_jpg/${imageId}/300`}));
const official2025Articles = [
  'https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652581690&idx=1&sn=1737a344064ed04f192bf782fa19331d#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652581842&idx=1&sn=67bc23195dc503d57a7f8af915bcf362#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652581962&idx=1&sn=81c448c7d381a82b5721c7cc16feec2d#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582003&idx=1&sn=eaf40b80e8c064c3264353a577f48246#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582391&idx=1&sn=43cdc6b2fc10cb30a4285e705d710fae#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582446&idx=1&sn=68fbf3272d5be1ddca0c0c9f41d06778#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582459&idx=1&sn=d5e85b8b73e850b6ee7ebcd801243165#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582460&idx=1&sn=58ac3490465ffe59b75e0cc9cca3900d#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582482&idx=1&sn=28ea02f7e6fd0af1cbaafe1055aa5987#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582490&idx=1&sn=12905338f7eb80c21a12a6b896a0cc14#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582501&idx=1&sn=da5076a8da6bc448cc847c147596759d#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582502&idx=1&sn=cbdc0ae5b1a3f59c2ccbf803ddc243bd#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582529&idx=1&sn=f6d8b43ccc600507421263df8616fefb#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582564&idx=1&sn=60f29e9e24efd3ffa3d1598e47db215a#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582611&idx=1&sn=eab71ba3b9b1e439d13fd2aa8d3a0110#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582612&idx=1&sn=53ad36e0450c713131fa8f1150020c60#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652582742&idx=1&sn=231224745577fa5a80a98f90d07a204d#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652583035&idx=1&sn=79c3edef8107e7f105b20228d6130c3e#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652583036&idx=1&sn=f0f2fc4d5566006448e6a15b1ab7c2d4#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652583245&idx=1&sn=f58faf27d9ac9d0316dd95f4c8908d08#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652583263&idx=1&sn=d023b65f02960c6a28cbe0163c181cf9#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652583276&idx=1&sn=b35a15c060c4502f3332440d32067381#rd','https://mp.weixin.qq.com/s?__biz=MjM5NjUxMTA4OA==&mid=2652583309&idx=1&sn=b8e0c3ea67e7c57e5b6c34e322af7781#rd'
];

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

function renderAdvancement() {
  const term = advancementSearch.value.trim().toLowerCase();
  const filtered = advancementRecords.filter((record) => String(record.year) === selectedYear && [record.college, record.title, record.summary, ...(record.metrics || [])].join(' ').toLowerCase().includes(term));
  visibleCount.textContent = filtered.length;
  advancementList.innerHTML = filtered.map((record, index) => `<article class="advancement-item"><span class="advancement-index">${String(index + 1).padStart(2, '0')}</span><div><div class="advancement-meta"><b>${escapeHtml(record.college)}</b><span>${record.year} 届</span></div><h3>${escapeHtml(record.title)}</h3><p>${escapeHtml(record.summary)}</p>${record.metrics?.length ? `<div class="advancement-metrics">${record.metrics.map((item) => `<strong>${escapeHtml(item)}</strong>`).join('')}</div>` : '<small class="advancement-pending">原始材料未公布统一人数或比例</small>'}<small class="advancement-source">${escapeHtml(record.source)}</small></div>${record.year === 2025 ? `<div class="advancement-actions">${record.images?.length ? `<button type="button" data-open-advancement-images="${record.id}">查看图片 <span>${record.images.length}</span></button>` : ''}<a href="${record.sourceUrl}" target="_blank" rel="noreferrer">公众号原文 ↗</a></div>` : ''}</article>`).join('') || '<p class="advancement-empty">没有找到对应学院，换个关键词试试。</p>';
  advancementList.querySelectorAll('[data-open-advancement-images]').forEach((button) => button.addEventListener('click', () => openAdvancementGallery(button.dataset.openAdvancementImages)));
}

async function initAdvancement() {
  try {
    const response = await fetch('data/advancement-data.json?v=20260801-2025-list-images');
    const data = await response.json();
    const imageResponse = await fetch('data/advancement-2025-images.json?v=20260801-2025-list-images');
    const images = await imageResponse.json();
    official2025Covers.forEach((record, index) => {
      const articleImages = images[record.college] || images[record.college.replace(/\s/g, '')] || [];
      record.id = `official-2025-${index}`;
      record.sourceUrl = official2025Articles[index] || data.official2025Album;
      // Omit generic shared covers and retain each academy's actual ranked list image.
      record.images = articleImages.filter((src) => !/-01\.(jpg|png)$/i.test(src));
    });
    advancementRecords = [...(data.records || []), ...official2025Covers];
    recordCount.textContent = (data.records || []).length;
    renderAdvancement();
  } catch (error) {
    advancementList.innerHTML = '<p class="advancement-empty">数据暂时无法加载，请稍后刷新页面再试。</p>';
  }
}

advancementSearch.addEventListener('input', renderAdvancement);
document.querySelectorAll('[data-advancement-year]').forEach((button) => button.addEventListener('click', () => { selectedYear = button.dataset.advancementYear; document.querySelectorAll('[data-advancement-year]').forEach((item) => item.classList.toggle('is-active', item === button)); renderAdvancement(); }));

function openAdvancementGallery(id) {
  const record = advancementRecords.find((item) => item.id === id);
  if (!record?.images?.length) return;
  let modal = document.querySelector('#advancementGallery');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'advancementGallery';
    modal.className = 'advancement-gallery';
    modal.innerHTML = '<button class="advancement-gallery-backdrop" type="button" aria-label="关闭图片查看"></button><section><button class="modal-close" type="button" aria-label="关闭图片查看">×</button><p>官方榜单图片</p><h2></h2><div></div><small>出处：南京工业大学学工在线 · 升学深造专辑</small></section>';
    document.body.appendChild(modal);
    modal.addEventListener('click', (event) => { if (event.target.matches('.advancement-gallery-backdrop,.modal-close')) modal.classList.remove('is-open'); });
  }
  modal.querySelector('h2').textContent = `${record.college} · 2025 届`;
  modal.querySelector('section > div').innerHTML = record.images.map((src, index) => `<a href="${src}" target="_blank" rel="noreferrer"><img src="${src}" alt="${escapeHtml(record.college)} 榜单图片 ${index + 1}" /></a>`).join('');
  modal.classList.add('is-open');
}
initAdvancement();
