import type { POI, RouteInfo, QAPair } from '../types';

export const pois: POI[] = [
  {
    id: 'poi_basic_ykfwzx',
    name: '东里村游客服务中心',
    shortDesc: '特色农副产品展示与休闲餐饮',
    longDesc: '东里村游客服务中心位于水库边，主要展示东里村及全镇特色农副产品和传统文化。这里不仅是介绍旅游景点的窗口，还为游客提供特色餐饮、休闲购物场所，是助推东里村乡村旅游发展的重要枢纽。',
    story: '建议游玩时长1小时。在这里你可以深入了解本地的副农产品知识，品尝地道风味，是进入东里村的第一站。',
    image: 'https://i.ibb.co/dsRgDNZ1/100-192.jpg', 
    gps: [118.20442982, 25.23773823],
    tags: ['游客服务', '特色餐饮', '农副产品'],
  },
  {
    id: 'poi_basic_xcfzzx',
    name: '东里村乡村发展中心',
    shortDesc: '艺术研学与乡村文化综合体',
    longDesc: '投入200万元建成，位于东里村小学。中心设置了乡村大舞台、餐饮、民宿、电商平台、农产品展示馆。这里还有黄文中油画工作室、乡贤郑金贵团队工作室、郑傅安油画工作室等，常年开展艺术对话展，是打造研学基地的重要配套。',
    story: '建议游玩2个小时。这里是旧校舍改造的典范，充满了浓厚的艺术气息。你可以在这里看到传统乡村与现代艺术的碰撞，甚至偶遇正在创作的艺术家。',
    image: 'https://i.ibb.co/VpMxRxj3/105-221.jpg',
    gps: [118.20918303, 25.23525132],
    tags: ['研学基地', '艺术工作室', '乡村大舞台'],
  },
  {
    id: 'poi_basic_ythms',
    name: '油桐花民宿',
    shortDesc: '伴花而居，尽享水库美景',
    longDesc: '民宿建筑面积700平方，坐落于油桐花海与仙夹水库边。设有10间精致民宿、书吧、大型开放式餐厅及会客厅。辅以油桐花特色手绘、夜景和音乐，为游客提供极具情调的住宿体验。',
    story: '常年营业。清晨推窗即是花海与湖光，夜晚在书吧静享阅读时光。这里的每一处细节都融入了油桐花元素，是放松身心的绝佳之地。',
    image: 'https://i.ibb.co/G3ncz111/121-292.jpg',
    gps: [118.20460919, 25.23843909],
    tags: ['精品民宿', '书吧', '油桐花海'],
  },
  {
    id: 'poi_basic_ythh',
    name: '油桐花海',
    shortDesc: '三四月间，漫山飞雪',
    longDesc: '每年的三月底四月初，仙夹镇东里村水库边上成片的油桐树如期开花。一树树繁花白如雪，布满枝头，清风拂过，落英缤纷，宛如一幅迷人的春日山野画卷。',
    story: '最佳观赏期在每年三月底四月初。油桐花又被称为“五月雪”（在本地气候下开花较早），花落时铺满山径，极其浪漫，是摄影爱好者的天堂。',
    image: 'https://i.ibb.co/ymdMQ6SN/98-181.jpg',
    gps: [118.20362427, 25.23779533],
    tags: ['自然景观', '赏花', '摄影圣地'],
  },
  {
    id: 'poi_donglired_xinhaijinianguan001',
    name: '永春辛亥革命纪念馆',
    shortDesc: '缅怀郑玉指，弘扬辛亥精神',
    longDesc: '为弘扬郑玉指大忠大孝的精神而建，依托东里村郑氏宗祠修建。馆内专门设立郑玉指展厅，展示永春人与辛亥革命的渊源，如颜子俊、宋渊源、郑玉指等30多位华侨支持孙中山革命的事迹。',
    story: '建议游玩20分钟。这里不仅是宗祠，更是爱国主义教育基地。核心展品包括青石板台阶、老式木桌、革命标语拓片和煤油灯，见证了那段峥嵘岁月。',
    image: 'https://i.ibb.co/21V3Jh2r/123-304.jpg',
    gps: [118.20524049, 25.23411225],
    tags: ['红色旅游', '历史文化', '郑氏宗祠'],
  },
  {
    id: 'poi_donglired_jingyizhuang001',
    name: '旌义状石碑',
    shortDesc: '孙中山颁发，见证革命功勋',
    longDesc: '位于村口侨光亭内。1912年孙中山就任临时大总统时，为表彰郑玉指对革命的贡献颁发“旌义状”。该状于民国年间刻于石碑，上端镌嵌孙中山影雕像及“双十旗”。1984年重新树立于此。',
    story: '建议游玩20分钟。这块石碑是国家级文物，碑上的孙中山像和双十旗雕刻精美。它静静矗立在村口雨亭中，诉说着百年前一位华侨的爱国赤诚。',
    image: 'https://i.ibb.co/fYvJfmtP/126-318.jpg',
    gps: [118.20423698, 25.23566419],
    tags: ['历史文物', '红色地标', '侨光亭'],
  }
];

export const allPoisMap = new Map<string, POI>(pois.map(p => [p.id, p]));

export const routes: RouteInfo[] = [
  {
    id: 'route_red',
    title: '红色记忆研学之旅',
    tag: '推荐',
    tagColor: 'bg-red-100 text-red-800',
    description: '探访辛亥革命遗迹，缅怀先烈丰功伟绩。',
    image: 'http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/shuyuan.webp-50?e=1763669915&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:rgb5WuVZsu13hdeiQlA9hLwEZtE=', // Updated image
    pois: ['poi_donglired_xinhaijinianguan001', 'poi_donglired_jingyizhuang001', 'poi_basic_xcfzzx']
  },
  {
    id: 'route_eco',
    title: '山水花海生态之旅',
    tag: '热门',
    tagColor: 'bg-green-100 text-green-800',
    description: '漫步油桐花海，宿水库边，品农家美食。',
    image: 'https://i.ibb.co/zWX80Lqp/150.png',
    pois: ['poi_basic_ythh', 'poi_basic_ythms', 'poi_basic_ykfwzx']
  },
  {
    id: 'route_art',
    title: '乡村文化艺术之旅',
    tag: '艺术',
    tagColor: 'bg-purple-100 text-purple-800',
    description: '打卡油画工作室，体验乡村大舞台的魅力。',
    image: 'https://i.ibb.co/Q3GZbVMX/133.png',
    pois: ['poi_basic_xcfzzx', 'poi_basic_ykfwzx']
  }
];

export const initialRagData: QAPair[] = [
  {
    id: 'qa_001',
    keywords: ['游客服务中心', '哪里', '吃饭', '特产'],
    answer: '东里村游客服务中心位于水库边，主要展示特色农副产品，提供餐饮休闲服务，是您了解本地特产的好去处。',
    poi: '东里村游客服务中心'
  },
  {
    id: 'qa_002',
    keywords: ['发展中心', '大舞台', '油画', '研学'],
    answer: '乡村发展中心位于东里村小学，集乡村大舞台、民宿、电商、农产品展示于一体，还有黄文中、郑傅安等名家的油画工作室。',
    poi: '东里村乡村发展中心'
  },
  {
    id: 'qa_003',
    keywords: ['民宿', '住宿', '住哪'],
    answer: '推荐您入住“油桐花民宿”，它位于油桐花海和水库边，有10间客房，配套书吧和餐厅，环境非常优美。',
    poi: '油桐花民宿'
  },
  {
    id: 'qa_004',
    keywords: ['花海', '开花', '什么时候', '油桐花'],
    answer: '油桐花海位于仙夹水库边。每年三月底四月初是最佳观赏期，届时满树白花如雪，非常壮观。',
    poi: '油桐花海'
  },
  {
    id: 'qa_005',
    keywords: ['辛亥革命', '纪念馆', '郑玉指'],
    answer: '永春辛亥革命纪念馆依托东里村郑氏宗祠修建，专门纪念郑玉指先生。馆内展示了郑玉指及其他华侨支持孙中山革命的事迹。',
    poi: '永春辛亥革命纪念馆'
  },
  {
    id: 'qa_006',
    keywords: ['石碑', '旌义状', '孙中山'],
    answer: '旌义状石碑位于村口侨光亭内。这是孙中山大总统于1912年颁发给郑玉指的，表彰他对革命的贡献。碑上刻有孙中山像和双十旗。',
    poi: '旌义状石碑'
  },
  {
    id: 'qa_history_001',
    keywords: ['郑玉指', '是谁', '照片'],
    answer: '郑玉指是永春县仙夹镇东里村人，清末民初的著名华侨。他追随孙中山先生参加辛亥革命，被授予“旌义状”。他不仅是革命功臣，也是著名的大孝子。',
    image: 'http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/%E9%83%91%E7%8E%89%E6%8C%87.jpg?e=1763669706&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:nAe770mU7HZ29Qiz1BOj7Uaw1Mg='
  },
  {
    id: 'qa_history_002',
    keywords: ['宋渊源', '是谁', '照片'],
    answer: '宋渊源，永春籍著名华侨、教育家、社会活动家。他早年加入同盟会，追随孙中山革命，曾任福建省侨务委员会委员等职，为家乡教育事业做出了巨大贡献。',
    image: 'http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/%E5%AE%8B%E6%B8%8A%E6%BA%90.jpg?e=1763669775&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:4TorkmcfnwZqC0G3v8ZAdG4MCuI='
  },
  {
    id: 'qa_history_003',
    keywords: ['李铁民', '是谁', '照片'],
    answer: '李铁民，永春籍归侨，著名社会活动家。他积极参与抗日救亡运动，曾任全国侨联副主席，一生致力于维护华侨权益和国家统一。',
    image: 'http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/%E6%9D%8E%E9%93%81%E6%B0%91.jpg?e=1763669601&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:vshvF183VpJxjmV69Qy3ac2wngs='
  },
  {
    id: 'qa_history_004',
    keywords: ['郑成快', '是谁', '照片'],
    answer: '郑成快是东里村的杰出乡贤代表之一，为乡村建设和文化传承做出了积极贡献。',
    image: 'http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/%E9%83%91%E6%88%90%E5%BF%AB.jpg-50?e=1763669651&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:_4fjPmV1QiyEVlScPDO5VjN0yBg='
  }
];