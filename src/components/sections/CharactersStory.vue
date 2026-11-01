<script setup lang="ts">
/**
 * 角色介绍 · 角色故事（时间轴）+ 星魂之语
 *
 * 时间轴条目按 BWIKI「流萤 / 角色故事一~四」改写为不剧透关键桥段的概述；
 * 星魂名为游戏内一至六星魂的官方名称。
 */
import { ref } from 'vue'

/** 时间轴条目 */
interface StoryNode {
  /** 纪元标签（金色小字） */
  era: string
  /** 节点标题 */
  title: string
  /** 概述正文 */
  text: string
}

/** 角色故事四幕（依据游戏内角色故事一~四概述） */
const STORY: StoryNode[] = [
  {
    era: '格拉默 · 铁骑纪元',
    title: '为女皇而生',
    text:
      '透明的培养仓中，编号 AR-26710 的少女睁开眼。格拉默共和国以基因编译铸造铁骑，' +
      '为「女皇陛下」而战，对抗无尽虫群——而每一位铁骑都携带着天生的缺陷，' +
      '注定在生命的某个时刻快速老去。',
  },
  {
    era: '覆灭 · 焦土之后',
    title: '最后的骑士',
    text:
      '虫潮吞没战线的那一刻，她在被母虫吞噬前引爆了足以毁灭行星的火弹。' +
      '共和国就此覆灭，只剩铁骑兵团的传闻。从昏迷中醒来时，她已漂泊于陌生的星系，' +
      '只剩失熵的命运，与没有答案的诘问——「为什么死去？为什么活着？」',
  },
  {
    era: '星核猎手 · 萨姆',
    title: '违抗命运的相遇',
    text:
      '「你相信命运么？同向而行的人终会在某个地方相聚。」艾利欧向她伸出手。' +
      '为了找寻「生」的机会，她以装甲「萨姆」之名加入星核猎手，' +
      '在剧本的字里行间，寻找属于自己的那一页。',
  },
  {
    era: '匹诺康尼 · 流萤',
    title: '以「流萤」之名',
    text:
      '无法做梦的少女以堪比「死亡」的代价坠入忆域，只为以普通人的身份活一次。' +
      '在盛会之星的灯火里，她第一次拥有了自己的名字——流萤。',
  },
]

/** 一至六星魂名（官方命名，连读即她的一生） */
const EIDOLONS: string[] = [
  '我曾安眠，赤染之茧',
  '自破碎的天空坠落',
  '沉睡在静默的星河',
  '我会看见，飞萤之火',
  '自无梦的长夜亮起',
  '绽放在终竟的明天',
]

const root = ref<HTMLElement | null>(null)
defineExpose({ root })
</script>

<template>
  <section ref="root" class="char-story reveal" aria-label="角色故事">
    <div class="section-head">
      <h2 class="section-title">角色故事</h2>
      <span class="section-title-en">Character Story</span>
      <span class="section-line" aria-hidden="true"></span>
    </div>

    <ol class="timeline">
      <li v-for="node in STORY" :key="node.title" class="node">
        <span class="node-era">{{ node.era }}</span>
        <h3 class="node-title">{{ node.title }}</h3>
        <p class="node-text">{{ node.text }}</p>
      </li>
    </ol>

    <div class="eidolons">
      <p class="eidolons-caption">星魂之语 —— 连起来，便是她的一生</p>
      <ol class="eidolons-list">
        <li v-for="(name, i) in EIDOLONS" :key="name" class="eidolon">
          <span class="eidolon-no">{{ ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ'][i] }}</span>
          <span class="eidolon-name">{{ name }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   区块标题（与页面其它 section 共用同一套样式语言）
   ============================================================ */

.section-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 26px;
}

.section-title {
  margin: 0;
  font-family: var(--f-serif-cn);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 32px);
  letter-spacing: 0.12em;
}

.section-title-en {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 15px;
  color: var(--dim);
  letter-spacing: 0.08em;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--line-2), transparent);
}

/* ============================================================
   时间轴
   ============================================================ */

.timeline {
  position: relative;
  margin: 0;
  padding: 0 0 0 28px;
  list-style: none;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(180deg, var(--line-2), rgba(150, 190, 245, 0.06));
}

.node {
  position: relative;
  padding: 0 0 30px 22px;
}

.node:last-child {
  padding-bottom: 0;
}

/* 轴上节点：金边萤火 */
.node::before {
  content: '';
  position: absolute;
  left: -26px;
  top: 7px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  background: var(--bg);
  box-shadow: 0 0 12px rgba(255, 203, 130, 0.5);
}

.node-era {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 12.5px;
  letter-spacing: 0.12em;
  color: var(--gold);
}

.node-title {
  margin: 4px 0 0;
  font-family: var(--f-serif-cn);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: 0.06em;
}

.node-text {
  margin: 8px 0 0;
  max-width: 62ch;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

/* ============================================================
   星魂之语
   ============================================================ */

.eidolons {
  margin-top: clamp(28px, 4vh, 40px);
  padding: clamp(18px, 2.4vw, 28px);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: linear-gradient(158deg, var(--panel-a), var(--panel-b));
}

.eidolons-caption {
  margin: 0 0 16px;
  font-family: var(--f-kai);
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--dim);
  text-align: center;
}

.eidolons-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.eidolon {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(9, 20, 39, 0.6);
}

.eidolon-no {
  flex: none;
  font-family: var(--f-display);
  font-style: italic;
  font-size: 14px;
  color: var(--gold);
}

.eidolon-name {
  font-family: var(--f-kai);
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--ink);
}

/* ---------- 响应式 ---------- */

@media (max-width: 860px) {
  .eidolons-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .eidolons-list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
