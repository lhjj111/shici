// 从复习手册 md 解析出古诗数据，生成 poems.js
import fs from 'node:fs';

const mdPath = '../小学古诗词考点分类复习（统编版）.md';
const md = fs.readFileSync(mdPath, 'utf8').split(/\r?\n/);

// 手动指定每个篇目的考点分类（与手册第一部分一致）
const M = {
  '咏鹅': ['咏物言志'],
  '赠刘景文': ['豁达乐观'],
  '清平乐·村居': ['田园山水', '童趣闲适'],
  '春夜喜雨': ['田园山水'],
  '示儿': ['爱国报国'],
  '闻官军收河南河北': ['爱国报国'],
  '从军行(其四)': ['爱国报国'],
  '出塞': ['爱国报国'],
  '凉州词': ['爱国报国'],
  '夏日绝句': ['爱国报国'],
  '己亥杂诗': ['爱国报国'],
  '题临安邸': ['爱国报国'],
  '塞下曲': ['爱国报国'],
  '秋夜将晓出篱门迎凉有感': ['忧国忧民'],
  '江上渔者': ['忧国忧民'],
  '悯农(其二)': ['忧国忧民'], '悯农(其一)': ['忧国忧民'],
  '蜂': ['忧国忧民', '咏物言志'],
  '春晓': ['田园山水'], '江南': ['田园山水'], '小池': ['田园山水'],
  '晓出净慈寺送林子方': ['田园山水'], '绝句(两个黄鹂)': ['田园山水'],
  '绝句(迟日江山丽)': ['田园山水'], '望庐山瀑布': ['田园山水'], '夜宿山寺': ['田园山水'],
  '敕勒歌': ['田园山水'], '山行': ['田园山水'], '望天门山': ['田园山水'],
  '饮湖上初晴后雨': ['田园山水'], '望洞庭': ['田园山水'], '惠崇春江晚景': ['田园山水'],
  '三衢道中': ['田园山水'], '浪淘沙': ['田园山水', '豁达乐观'], '江南春': ['田园山水'],
  '书湖阴先生壁': ['田园山水'], '六月二十七日望湖楼醉书': ['田园山水'],
  '西江月·夜行黄沙道中': ['田园山水'], '四时田园杂兴(其二十五)': ['田园山水'],
  '四时田园杂兴(其三十一)': ['田园山水', '童趣闲适'], '山居秋暝': ['田园山水'],
  '鹿柴': ['田园山水'], '忆江南': ['田园山水'], '暮江吟': ['田园山水'],
  '鸟鸣涧': ['田园山水', '豁达乐观'], '春日': ['田园山水'], '乡村四月': ['田园山水'],
  '早春呈水部张十八员外': ['田园山水'], '清平乐(春归何处)': ['田园山水'],
  '咏柳': ['田园山水', '咏物言志'], '滁州西涧': ['田园山水'], '游园不值': ['田园山水'],
  '静夜思': ['思乡思亲'], '九月九日忆山东兄弟': ['思乡思亲', '节日风俗'],
  '枫桥夜泊': ['思乡思亲'], '泊船瓜洲': ['思乡思亲'], '回乡偶书': ['思乡思亲'],
  '长相思': ['思乡思亲'], '十五夜望月': ['思乡思亲', '节日风俗'],
  '采薇(节选)': ['思乡思亲'], '夜书所见': ['思乡思亲'], '宿建德江': ['思乡思亲'],
  '游子吟': ['思乡思亲'],
  '赠汪伦': ['送别友情'], '送元二使安西': ['送别友情'],
  '芙蓉楼送辛渐': ['送别友情', '咏物言志'], '黄鹤楼送孟浩然之广陵': ['送别友情'],
  '卜算子·送鲍浩然之浙东': ['送别友情'], '过故人庄': ['送别友情', '田园山水'],
  '别董大': ['豁达乐观', '送别友情'],
  '早发白帝城': ['豁达乐观'], '浣溪沙(游蕲水清泉寺)': ['豁达乐观'], '登鹳雀楼': ['豁达乐观', '咏物言志'],
  '梅花': ['咏物言志'], '墨梅': ['咏物言志'], '竹石': ['咏物言志'], '石灰吟': ['咏物言志'],
  '马诗': ['咏物言志', '爱国报国'], '蝉': ['咏物言志'], '雪梅': ['咏物言志'],
  '题西林壁': ['咏物言志'], '江雪': ['咏物言志'], '赋得古原草送别': ['咏物言志'],
  '嫦娥': ['咏物言志'], '画': ['咏物言志'], '风': ['咏物言志'],
  '古朗月行(节选)': ['咏物言志'], '江畔独步寻花': ['咏物言志'],
  '乞巧': ['咏物言志', '节日风俗'], '卜算子·咏梅': ['咏物言志'],
  '长歌行': ['惜时劝学'],
  '元日': ['节日风俗'], '清明': ['节日风俗'], '寒食': ['节日风俗'],
  '迢迢牵牛星': ['节日风俗'],
  '池上': ['童趣闲适'], '所见': ['童趣闲适'], '小儿垂钓': ['童趣闲适'],
  '宿新市徐公店': ['童趣闲适', '田园山水'], '稚子弄冰': ['童趣闲适'],
  '村晚': ['童趣闲适'], '村居': ['童趣闲适', '田园山水'],
  '渔歌子': ['童趣闲适', '田园山水'], '寻隐者不遇': ['童趣闲适'],
};

const CAT_ALIAS = { '爱国忧民': '爱国报国', '咏物言志·哲理': '咏物言志' };

function dynOf(rest) {
  if (rest.includes('《诗经')) return '西周';
  if (rest === '汉乐府') return '汉';
  if (rest === '北朝民歌') return '北朝';
  if (rest === '《古诗十九首》') return '汉';
  return '';
}

const poems = [];
let grade = '';
let inAppendix = false;
let appendCat = '';

for (let i = 0; i < md.length; i++) {
  const s = md[i].trim();
  if (!s) continue;

  if (s.startsWith('### ')) {
    if (!s.includes('《')) {          // 附录内的分类小标题
      if (inAppendix) {
        appendCat = CAT_ALIAS[s.slice(4).split('（')[0].trim()] || s.slice(4).split('（')[0].trim();
      }
      continue;
    }
    const m = s.match(/^### 《([^》]+?)》\s*(?:[（(]([^）)]+)[）)])?\s*(.*)$/);
    if (!m) continue;
    const title = m[1] + (m[2] ? '(' + m[2] + ')' : '');
    let rest = m[3].trim();
    let note = '';
    const nm = rest.match(/（(.+?)）$/);
    if (nm) { note = nm[1]; rest = rest.slice(0, nm.index).trim(); }
    rest = rest.replace(/^(（.+?）|\(.+?\))\s*/, '').trim();  // 去掉开头括号说明（如 游蕲水清泉寺）
    let author, dyn = '';
    if (rest.includes('《诗经')) { author = '《诗经·小雅》'; dyn = '西周'; }
    else if (rest.includes('·')) { [author, dyn] = rest.split('·').map(x => x.trim()); }
    else { author = rest || '佚名'; dyn = dynOf(rest); }

    const lines = [];
    let k = '', w = '';
    for (let j = i + 1; j < md.length; j++) {
      const nxt = md[j].trim();
      if (nxt.startsWith('### ') || nxt.startsWith('## ') || nxt.startsWith('#')) break;
      if (nxt.startsWith('**【考点】') || nxt.startsWith('【考点】')) {
        const km2 = nxt.match(/【考点】(.+?)【易错字】(.+)$/);
        if (km2) { k = km2[1].replace(/\*/g, '').trim(); w = km2[2].replace(/\*/g, '').trim(); }
        break;
      }
      if (nxt && !nxt.startsWith('>')) lines.push(nxt);
    }

    const cats = (!M[title] && inAppendix && appendCat !== '课外必背') ? [appendCat] : (M[title] || ['田园山水']);
    poems.push({
      t: title, a: author, d: dyn, g: grade,
      c: cats[0], tags: cats.slice(1),
      lines, k, w, note,
    });
    i += lines.length + 1;
    continue;
  }

  if (s.startsWith('# ')) {
    if (s.includes('附录')) { inAppendix = true; grade = '课外必背'; appendCat = '课外必背'; }
    continue;
  }
  if (s.startsWith('## ')) {
    const h = s.slice(3);
    if (/^(一|二|三|四|五|六)年级/.test(h)) { grade = h; inAppendix = false; }
    else if (h.startsWith('附录')) { inAppendix = true; grade = '课外必背'; appendCat = '课外必背'; }
    else { inAppendix = false; }
    continue;
  }
}

const out = '// 由 parse.mjs 自动生成，请勿手改\nwindow.POEMS = ' + JSON.stringify(poems) + ';';
fs.writeFileSync('poems.js', out, 'utf8');
console.log('共解析出古诗', poems.length, '首');
for (const cat of [...new Set(poems.map(p => p.c))]) {
  console.log(' ', cat, poems.filter(p => p.c === cat).length + '首');
}
for (const t of ['咏鹅', '示儿', '采薇(节选)', '浣溪沙']) {
  const p = poems.find(x => x.t === t);
  if (p) console.log('---', p.t, p.a, p.d, p.g, '| 考点:', p.k, '| 行数:', p.lines.length);
}
const noLines = poems.filter(p => !p.lines.length);
const noK = poems.filter(p => !p.k);
console.log('无正文行:', noLines.map(p => p.t).join('、') || '无');
console.log('无考点:', noK.map(p => p.t).join('、') || '无');
