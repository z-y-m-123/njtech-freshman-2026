const dataUrl = 'data/transfer-data.json?v=20260723-transfer-downloads';
const transferDownloads = [
  { group: '官方方案', title: '2026年本科生转专业工作方案', file: 'transfer-2026-plan.pdf', type: 'PDF' },
  { group: '官方方案', title: '关于公布2026年本科生转专业工作方案的通知', file: 'transfer-2026-notice.pdf', type: 'PDF' },
  { group: '流程规则', title: '开展2026年本科生转专业工作的通知', file: 'transfer-2026-process.pdf', type: 'PDF' },
  { group: '流程规则', title: '本科生转专业实施办法（2024年修订）', file: 'transfer-policy-2024.pdf', type: 'PDF' },
  { group: '表格材料', title: '2026年普通本科生转专业工作方案表', file: 'transfer-ordinary-plan-2026.xlsx', type: 'XLSX' },
  { group: '表格材料', title: '学生转专业家长知情同意书', file: 'transfer-parent-consent.docx', type: 'DOCX' },
  { group: '先修课程清单', title: '2011学院：先修课程清单', file: 'prereq-2011.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '交通学院：先修课程清单', file: 'prereq-transportation.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '化学与分子工程学院：先修课程清单', file: 'prereq-chemistry-analysis.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '化工学院：先修课程清单', file: 'prereq-chemical-engineering.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '土木学院：先修课程清单', file: 'prereq-civil-engineering.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '城建学院：先修课程清单', file: 'prereq-urban-construction.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '安全学院：先修课程清单', file: 'prereq-safety.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '应急学院：先修课程清单', file: 'prereq-emergency.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '建筑学院：先修课程清单', file: 'prereq-architecture.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '数理学院：先修课程清单', file: 'prereq-math-physics.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '机械学院：先修课程清单', file: 'prereq-mechanical.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '材料学院：先修课程清单', file: 'prereq-materials.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '柔电学院：先修课程清单', file: 'prereq-flexible-electronics.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '法政学院：先修课程清单', file: 'prereq-law-politics.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '测绘学院：先修课程清单', file: 'prereq-surveying.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '环境学院：先修课程清单', file: 'prereq-environment.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '生工学院：先修课程清单', file: 'prereq-biological-engineering.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '电控学院：先修课程清单', file: 'prereq-electrical-control.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '经管学院：先修课程清单', file: 'prereq-economics-management.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '能源学院：先修课程清单', file: 'prereq-energy.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '艺术学院：先修课程清单', file: 'prereq-art.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '药学学院：先修课程清单', file: 'prereq-pharmacy.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '计信学院：先修课程清单', file: 'prereq-computer-information.xlsx', type: 'XLSX' },
  { group: '先修课程清单', title: '食品学院：先修课程清单', file: 'prereq-food.xlsx', type: 'XLSX' },
  { group: '答疑参考', title: '转专业答疑', file: 'transfer-faq.pdf', type: 'PDF' },
  { group: '答疑参考', title: '25届26年转专业全流程教学（非官方参考）', file: 'transfer-peer-guide-2026.docx', type: 'DOCX' },
  { group: '考试大纲', title: '公共基础课程：高等数学考试大纲', file: 'outline-advanced-math.pdf', type: 'PDF' },
  { group: '考试大纲', title: '外语学院：基础日语-2考试大纲', file: 'outline-japanese-2.pdf', type: 'PDF' },
  { group: '考试大纲', title: '外语学院：基础西班牙语-2考试大纲', file: 'outline-spanish-2.pdf', type: 'PDF' },
  { group: '考试大纲', title: '外语学院：现代汉语考试大纲', file: 'outline-modern-chinese.pdf', type: 'PDF' },
  { group: '考试大纲', title: '外语学院：综合英语-2考试大纲', file: 'outline-comprehensive-english-2.pdf', type: 'PDF' },
  { group: '考试大纲', title: '建筑学院：设计基础综合考试大纲', file: 'outline-design-foundation.pdf', type: 'PDF' },
  { group: '考试大纲', title: '数理学院：大学物理A-1考试大纲', file: 'outline-physics-a1.docx', type: 'DOCX' },
  { group: '考试大纲', title: '数理学院：大学物理A考试大纲', file: 'outline-physics-a.docx', type: 'DOCX' },
  { group: '考试大纲', title: '数理学院：材料力学A考试大纲', file: 'outline-material-mechanics.docx', type: 'DOCX' },
  { group: '考试大纲', title: '数理学院：理论力学A考试大纲', file: 'outline-theoretical-mechanics.docx', type: 'DOCX' },
  { group: '考试大纲', title: '法政学院：民法基础与刑法基础考试大纲', file: 'outline-civil-criminal-law.pdf', type: 'PDF' },
  { group: '考试大纲', title: '电控学院：电路分析考试大纲', file: 'outline-circuit-analysis.pdf', type: 'PDF' },
  { group: '考试大纲', title: '经管学院：基础会计考试大纲', file: 'outline-basic-accounting.pdf', type: 'PDF' },
  { group: '考试大纲', title: '计信学院：数据结构与算法考试大纲', file: 'outline-data-structure-algorithm.pdf', type: 'PDF' },
  { group: '考试大纲', title: '计信学院：程序设计语言考试大纲', file: 'outline-programming-language.pdf', type: 'PDF' },
  { group: '考试大纲', title: '计信学院：高级程序设计考试大纲', file: 'outline-advanced-programming.pdf', type: 'PDF' }
];
const pendingSafeConversion = [
  '转专业大一流程安排（WPS 文件）'
];
const state = { data: null, grade: 'all', college: 'all', query: '' };

const head = document.querySelector('#transferTableHead');
const body = document.querySelector('#transferTableBody');
const note = document.querySelector('#transferResultNote');
const kindSelect = document.querySelector('#transferKind');
const gradeSelect = document.querySelector('#transferGrade');
const collegeSelect = document.querySelector('#transferCollege');
const searchInput = document.querySelector('#transferSearch');

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}

function setText(id, value) {
  const node = document.querySelector(id);
  if (node) node.textContent = value;
}

function fillStats(summary) {
  setText('#ordinaryRecords', summary.ordinary.records);
  setText('#ordinaryPlan', summary.ordinary.planTotal);
  setText('#writtenCount', summary.ordinary.writtenRequired);
}

function fillTimeline(rules) {
  document.querySelector('#transferTimeline').innerHTML = rules.timeline2026
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
}

function fillFiles(files) {
  const groups = files.reduce((acc, file) => {
    (acc[file.category] ||= []).push(file.name);
    return acc;
  }, {});
  const order = ['流程规则', '先修课程', '笔试大纲', '答疑材料', '申请材料', '其他材料'];
  document.querySelector('#transferFileGroups').innerHTML = order
    .filter((name) => groups[name]?.length)
    .map((name) => `<article class="transfer-file-group"><h3>${escapeHtml(name)}</h3><ul>${groups[name].map((file) => `<li>${escapeHtml(file)}</li>`).join('')}</ul></article>`)
    .join('');
}

function fillDownloads() {
  const container = document.querySelector('#transferDownloadGroups');
  if (!container) return;
  const groups = transferDownloads.reduce((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});
  container.innerHTML = Object.entries(groups).map(([group, items]) => `
    <article class="transfer-download-group">
      <h3>${escapeHtml(group)}</h3>
      <div>
        ${items.map((item) => `
          <a href="assets/transfer-docs/${encodeURIComponent(item.file)}" download="${escapeHtml(item.title)}.${item.type.toLowerCase()}">
            <span>${escapeHtml(item.type)}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <small>下载 ↘</small>
          </a>
        `).join('')}
      </div>
    </article>
  `).join('') + `
    <article class="transfer-download-group is-pending">
      <h3>待安全转换后补齐</h3>
      <p class="transfer-pending-note">考试大纲里的旧版 .doc 已转换为 PDF 并加入下载区。下面仅剩 WPS 格式流程文件，暂不直接公开原件；后续转成 PDF/DOCX 后再加入白名单下载。</p>
      <ul class="transfer-pending-list">
        ${pendingSafeConversion.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </article>
  `;
}

function fillSelect(select, values, firstLabel) {
  select.innerHTML = `<option value="all">${firstLabel}</option>` + values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('');
}

function currentRecords() {
  return state.data.ordinary || [];
}

function syncFilters() {
  const records = currentRecords();
  const grades = [...new Set(records.map((item) => item.sourceGrade).filter(Boolean))].sort();
  const colleges = [...new Set(records.map((item) => item.college).filter(Boolean))].sort();
  fillSelect(gradeSelect, grades, '全部年级');
  fillSelect(collegeSelect, colleges, '全部学院');
  state.grade = 'all';
  state.college = 'all';
}

function renderTable() {
  const records = currentRecords();
  const query = state.query.trim().toLowerCase();
  const filtered = records.filter((item) => {
    const gradeOk = state.grade === 'all' || item.sourceGrade === state.grade;
    const collegeOk = state.college === 'all' || item.college === state.college;
    const text = Object.values(item).join(' ').toLowerCase();
    return gradeOk && collegeOk && (!query || text.includes(query));
  });

  head.innerHTML = '<tr><th>学院</th><th>专业</th><th>年级</th><th>接收计划</th><th>第二志愿</th><th>先修课</th><th>考核</th><th>备注/联系</th></tr>';
  body.innerHTML = filtered.slice(0, 160).map((item) => `
    <tr>
      <td>${escapeHtml(item.college)}</td>
      <td>${escapeHtml(item.major)}</td>
      <td>${escapeHtml(item.sourceGrade)} → ${escapeHtml(item.targetGrade)}</td>
      <td>${escapeHtml(item.plan)}</td>
      <td>${escapeHtml(item.secondChoice)}</td>
      <td>${escapeHtml(item.prerequisite)}</td>
      <td>学业 ${escapeHtml(item.academicWeight)} / 笔试 ${escapeHtml(item.writtenWeight)} / 面试 ${escapeHtml(item.interviewWeight)}<br />科目：${escapeHtml(item.writtenSubject || '无')}</td>
      <td>${escapeHtml(item.remarks || '—')}<br />${escapeHtml(item.contact || '')}</td>
    </tr>`).join('');

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="8">没有筛到结果，换个学院、年级或关键词试试。</td></tr>`;
  }
  note.textContent = `当前显示 ${Math.min(filtered.length, 160)} / ${filtered.length} 条普通本科生方案；为了页面流畅，单次最多展示 160 条。`;
}

async function boot() {
  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  state.data = JSON.parse(new TextDecoder('utf-8').decode(buffer));
  fillStats(state.data.summary);
  fillTimeline(state.data.rules);
  fillFiles(state.data.files);
  fillDownloads();
  syncFilters();
  renderTable();
}

kindSelect?.addEventListener('change', () => {
  syncFilters();
  renderTable();
});
gradeSelect.addEventListener('change', () => { state.grade = gradeSelect.value; renderTable(); });
collegeSelect.addEventListener('change', () => { state.college = collegeSelect.value; renderTable(); });
searchInput.addEventListener('input', () => { state.query = searchInput.value; renderTable(); });

boot().catch(() => {
  body.innerHTML = '<tr><td>转专业资料加载失败，请刷新页面再试。</td></tr>';
});
