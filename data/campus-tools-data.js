(function () {
  const official = (title, url) => ({ sourceLabel: title, sourceYear: '2026', freshness: 'official-2026', officialUrl: url });
  const reference = { sourceLabel: '2024-2025 年公开新生与体育资料', sourceYear: '2024-2025', freshness: 'reference-2024-2025', officialUrl: 'https://www.njtech.edu.cn/' };
  const location = { sourceLabel: '公开地图地点资料整理', sourceYear: '2026', freshness: 'location-reference', officialUrl: 'https://www.amap.com/search?query=%E5%8D%97%E4%BA%AC%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%B1%9F%E6%B5%A6%E6%A0%A1%E5%8C%BA' };
  const checklist = [
    ['notice', '核对录取与报到通知', '确认报到日期、校区、学院要求与官方联系渠道。'],
    ['documents', '整理证件与电子材料', '录取通知书、身份证及通知要求的材料单独收纳。'],
    ['channels', '关注官方通知渠道', '以学院和学校官方平台通知为准。'],
    ['route', '规划到校路线', '先确认校区和校门，再规划高铁站、机场或市内换乘。'],
    ['digital', '准备校园数字服务', '按学校指引完成迎新、校园卡、网络与教学平台设置。'],
    ['support', '了解资助与绿色通道', '有需要时尽早从学校官方渠道查询。'],
  ].map(([id, title, summary]) => ({ id: 'check-' + id, title, category: '准备', keywords: ['报到', '新生', '准备', title], summary, ...official('2026 级新生入学指南', 'https://yx.njtech.edu.cn') }));
  const lifeRows = [
    ['transport', '交通与到校', '江浦校区面积较大，预留教学区之间的步行时间；校车班次以学校后勤通知为准。', '交通 班车 地铁 校车', 'https://hqc.njtech.edu.cn/'],
    ['food', '食堂与吃饭', '多个宿舍与教学区域都有餐饮服务，营业与窗口以现场为准。', '食堂 吃饭 清真', 'https://hqc.njtech.edu.cn/'],
    ['card', '证件与校园卡', '学生证和校园卡贯穿日常场景；遗失后通过官方窗口办理。', '校园卡 学生证 挂失', 'https://zfw.njtech.edu.cn'],
    ['repair', '报修、用水与网络', '记录楼栋、房间、设备编号和故障现象后，按当前流程报修。', '报修 水电 网络 空调', 'https://zfw.njtech.edu.cn'],
    ['safety', '校园安全', '涉及缴费、验证码、银行卡和陌生链接的信息先通过官方渠道核实。', '安全 诈骗 防盗', 'https://www.njtech.edu.cn/'],
    ['express', '快递与生活服务', '收件地址尽量精确到校区和宿舍区，取件后核对姓名和取件码。', '快递 打印 生活服务', 'https://hqc.njtech.edu.cn/'],
    ['pu', 'PU 第二课堂', '报名后留意时间、地点、签到和取消规则；认定以当年通知为准。', 'PU 第二课堂 活动 学时', 'https://www.njtech.edu.cn/'],
    ['library', '图书馆', '馆藏、预约选座、借阅数量和开放时间以图书馆公告为准。', '图书馆 借阅 自习 选座', 'https://lib.njtech.edu.cn/'],
    ['student-union', '学生组织', '学生组织开展权益、学习、体育、文艺、宣传等活动，招新以当年通知为准。', '学生会 学生组织 招新', 'https://www.njtech.edu.cn/'],
    ['growth', '竞赛与成长', '优先选择与兴趣和专业基础匹配的方向，关注学院和教务处当年通知。', '竞赛 创新创业 挑战杯', 'competitions.html'],
  ];
  const lifeGuides = lifeRows.map(([id, title, summary, keywords, officialUrl]) => ({ id: 'life-' + id, title, category: '生活', keywords: keywords.split(' '), summary, ...reference, officialUrl }));
  const everydayGuides = [
    ['dorm-map', '宿舍与地图', '先通过高清图确认宿舍区，再用实时导航核对实际路线。', '宿舍 地图 校区', 'campus-map.html'],
    ['card-id', '校园卡与证件', '学生证和校园卡会用于日常场景；遗失或办理请以学校当前官方流程为准。', '校园卡 学生证 证件', 'services.html'],
    ['express-print', '快递与打印', '收件地址写清校区和宿舍区；取件、打印等生活服务以现场安排为准。', '快递 打印 生活服务', 'https://hqc.njtech.edu.cn/'],
    ['clubs-pu', '社团与第二课堂', '关注学院和学校当年通知，活动报名后留意时间、地点和签到规则。', '社团 第二课堂 PU 活动', 'messages.html'],
    ['library-info', '图书馆', '馆藏、借阅、选座与开放时间以图书馆公告为准。', '图书馆 借阅 自习 选座', 'https://lib.njtech.edu.cn/'],
    ['campus-safety', '校园安全', '涉及缴费、验证码、银行卡和陌生链接的信息，先通过官方渠道核验。', '安全 防诈 紧急', 'services.html#campusPhonebook'],
    ['sunshine-run', '阳光长跑', '阳光长跑的时间、路线、签到与认定规则以体育部当年通知为准。', '阳光长跑 跑步 体育 体测', 'https://tyxy.njtech.edu.cn/'],
  ].map(([id, title, summary, keywords, officialUrl]) => ({ id: 'everyday-' + id, title, category: '生活', keywords: keywords.split(' '), summary, ...reference, officialUrl }));
  const sportRows = [
    ['basketball', '篮球', '球类'], ['volleyball', '排球', '球类'], ['football', '足球', '球类'], ['table-tennis', '乒乓球', '球类'], ['tennis', '网球', '球类'], ['badminton', '羽毛球', '球类'], ['bodybuilding', '健美', '体能'], ['aerobics', '健美操', '律动'], ['martial-arts', '武术', '武术'], ['health-sports', '保健', '康复'], ['softball', '垒球', '球类'], ['dance-sport', '体育舞蹈', '律动'], ['taekwondo', '跆拳道', '武术'], ['five-a-side', '五人足球', '球类'], ['body-shaping', '形体', '律动'], ['orienteering', '定向越野', '户外'], ['dragon-lion', '舞龙舞狮', '传统'], ['yoga', '瑜伽', '身心'], ['tai-chi', '太极养生', '传统'], ['air-volleyball', '气排球', '球类'], ['hand-lion', '手狮', '传统'], ['sandboard-table-tennis', '砂板乒乓球', '球类'], ['darts', '飞镖', '技巧'], ['roller-skating', '轮滑', '户外'], ['dragon-boat', '龙舟', '水上'], ['glide-bike', '滑行车', '户外'], ['pickleball', '匹克球', '球类'],
  ];
  const sportDescriptions = [
    '运球、传接球、投篮、移动、防守、突破、篮板与基础攻防战术。', '准备姿势、移动、垫球、发球、传球、扣球、拦网与战术入门。', '传接球、运球、抢截、守门、头球、过人与基本战术。', '步法、发球与接发球、推挡、攻球、搓球及综合练习。', '握拍、移动、正反手抽击、截击、发球、底线防守与双打配合。', '握拍、发球、击球、步法、组合技术及单双打教学比赛。', '杠铃、哑铃、壶铃、拉力器及单杠、双杠、跳跃等练习。', '基本手臂、腿部动作与步伐，华尔兹组合及大众健美操套路。', '柔韧、手型步型、腿法、跳跃、滚翻、功力拳、散手与防身术。', '面向因病、残等原因不能参加普通体育课的学生，含八段锦、太极拳等。', '接传球、投接手、封杀触杀、击球跑垒与基础攻防战术。', '华尔兹、探戈、伦巴、恰恰的基本技能、技术与动作套路。', '柔韧、品势、步法腿法、防守反击、组合技战术与防身术。', '传接球、运球、抢截、守门、头球、过人与基础战术。', '手臂摆动、身体波浪、舞姿、基本步伐、把杆与姿态组合。', '校园定向、情景定向、百米定向、定向拓展与参赛技能。', '舞龙持龙方法、步型步法与套路；南狮手法、身法、步法和神态。', '热身、呼吸、体位、冥想、放松、休息术与自编套路。', '站桩、步型、手型、平衡练习及杨式、孙式太极拳套路。', '传球、插托击球、发接扣拦防及站位与轮转。', '学习手狮与劲扇常用套路组合及分解动作。', '基本步法、发接球、推挡、攻球、弧圈与砂板竞赛规则。', '握镖、站姿、投掷、礼仪、高分区练习及 301 减分赛。', '站立、直线滑行、重心转换、制动、弯道、过桩及单脚动作。', '坐姿握桨、插拉出回桨、鼓手与舵手技术、起航、途中划与冲刺。', '直线、弯道、换脚、长短距离骑行及力量、协调、耐力训练。', '融合羽毛球、乒乓球与网球元素，学习球拍击球及单双打配合。',
  ];
  const sports = sportRows.map(([id, title, sportCategory], index) => ({ id: 'sport-' + id, title, category: '体育', sportCategory, keywords: ['体育课', '选课', sportCategory, title], summary: sportDescriptions[index], ...reference, officialUrl: 'https://tyxy.njtech.edu.cn/' }));
  const placeRows = [
    ['southwest-gate', '西南门', '校门'], ['southeast-gate', '东南门', '校门'], ['tianbao-ge', '天宝阁', '景观'], ['zhuoyi-softball', '卓逸垒球场', '运动'], ['xingjian-track', '行健田径场', '运动'], ['canteen-interior', '食堂内景', '生活'], ['yaqing-east-road', '亚青东路', '景观'], ['yifu-library', '逸夫图书馆', '教学与学院'], ['yaqing-square', '亚青广场', '景观'], ['houxue-north-road', '厚学北路', '景观'], ['yaqing-dorm', '亚青学生公寓', '生活'], ['yaqing-middle-road', '亚青中路', '景观'], ['yaqing-canteen', '亚青食堂', '生活'], ['yaqing-track', '亚青田径场', '运动'], ['xingjian-gym', '行健体育馆', '运动'], ['jinghu', '镜湖', '景观'], ['duxue-building', '笃学楼', '教学与学院'], ['boxue-building', '博学楼', '教学与学院'], ['tongji-lake', '溢清同济湖', '景观'], ['shijun-garden', '时钧园', '景观'], ['hongyi-building', '弘毅楼', '教学与学院'], ['houxue-building', '厚学楼', '教学与学院'], ['environment-school', '环境科学与工程学院', '教学与学院'], ['materials-school', '材料科学与工程学院', '教学与学院'], ['chemical-school', '化工学院', '教学与学院'], ['chemistry-school', '化学与分子工程学院', '教学与学院'], ['electrical-school', '电气工程与控制科学学院', '教学与学院'], ['mechanical-school', '机械与动力工程学院', '教学与学院'], ['energy-school', '能源科学与工程学院', '教学与学院'], ['pharmacy-school', '药学院', '教学与学院'], ['architecture-school', '建筑学院', '教学与学院'], ['art-school', '艺术设计学院', '教学与学院'], ['management-school', '经济与管理学院', '教学与学院'], ['law-school', '法政学院', '教学与学院'], ['language-school', '外国语言文学学院', '教学与学院'], ['bio-school', '生物与制药工程学院', '教学与学院'], ['food-school', '食品与轻工学院', '教学与学院'], ['computer-school', '计算机与信息工程学院', '教学与学院'], ['math-school', '数理科学学院', '教学与学院'], ['surveying-school', '测绘科学与技术学院', '教学与学院'], ['transport-school', '交通运输工程学院', '教学与学院'], ['urban-school', '城市建设学院', '教学与学院'], ['civil-school', '土木工程学院', '教学与学院'], ['college-2011', '2011学院', '教学与学院'], ['nanyuan-dorm', '南苑学生公寓', '生活'], ['xiyuan-dorm', '西苑宿舍', '生活'], ['dongyuan-dorm', '东苑宿舍区', '生活'], ['beiyuan-dorm', '北苑宿舍区', '生活'], ['xiangshan-dorm', '象山苑学生公寓', '生活'],
  ];
  const places = placeRows.map(([id, title, placeCategory]) => ({ id: 'place-' + id, title, category: '地点', placeCategory, keywords: [title, placeCategory, '江浦校区', '地图'], summary: '江浦校区地点参考，具体位置请结合站内高清图和实时导航确认。', mapQuery: '南京工业大学江浦校区 ' + title, ...location }));
  const linkRows = [
    ['arrival', '2026 迎新系统', '迎新、信息采集与报到服务。', 'https://yx.njtech.edu.cn'], ['academic', '教务处', '本科教学、学籍、选课和通知。', 'https://jwc.njtech.edu.cn/'], ['schedule', '课表与空教室查询', '通过教务系统查询课表与空闲教室。', 'https://jwgl.njtech.edu.cn/xtgl/login_slogin.html'], ['network', '网络自服务', '学校官方上网用户自服务入口。', 'https://zfw.njtech.edu.cn'], ['logistics', '后勤与校医院', '后勤服务、维修与校医院公告。', 'https://hqc.njtech.edu.cn/'], ['library', '图书馆', '馆藏、借阅、座位与数据库服务。', 'https://lib.njtech.edu.cn/'], ['bus', '校车信息', '后勤处发布的校车安排。', 'https://hqc.njtech.edu.cn/article.jsp?urltype=news.NewsContentUrl&wbtreeid=1075&wbnewsid=7787'], ['transfer', '转专业专题', '站内方案、流程、先修课和资料下载。', 'transfer.html'], ['competition', '竞赛目录', '站内学科竞赛与创新创业目录。', 'competitions.html'], ['advancement', '升学去向', '站内公开升学荣誉榜整理。', 'advancement.html'],
  ];
  const officialLinks = linkRows.map(([id, title, summary, officialUrl]) => ({ id: 'official-' + id, title, category: '官方核验', keywords: [title, '官方', '入口'], summary, ...official('南京工业大学及站内官方入口整理', officialUrl), freshness: 'official-link' }));
  window.NJTECH_CAMPUS_TOOLS = { checklist, lifeGuides, everydayGuides, sports, places, officialLinks };
}());
