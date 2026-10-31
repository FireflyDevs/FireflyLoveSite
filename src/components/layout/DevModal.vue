<script setup lang="ts">
/**
 * 「开发窗口」弹窗（原 `1.html` 的 `#devModal`）。
 *
 * 结构移植自 `1.html:3748-3838`，样式移植自 `1.html:1959-2166` 与
 * 响应式 `1.html:2829-2867`。
 *
 * ## 与组件树的挂载关系
 *
 * 挂在 `App.vue` 的最外层。它不属于任何页面，也不属于顶栏/页脚，
 * 而是全站共用的一个浮层——放在根组件可以保证：
 * - 切路由时不会重复挂载，开合状态不丢；
 * - 固定在 `body` 流末尾之上，不受任何页面的 `overflow` / `z-index` 裁切。
 *
 * ## 状态来源
 *
 * 开合状态由 `useDevModal` 单例持有，本组件只负责渲染与登记根节点。
 * 触发器是全站任意带 `data-modal` 属性的元素（顶栏、页脚、移动端底栏、
 * Hero、新闻卡、快捷入口），由 `installDevModalTrigger` 在 `App.vue` 里
 * 一次性统一委托，各组件无需感知弹窗。
 *
 * ## 样式类名的定位基准
 *
 * 原稿是单页全局样式，`.btn` / `.kicker` / `.divider` 等与页面其它段共用。
 * 迁移后这些类名在别处也有同名规则（如 `HeroSection` 的 `.btn`），因此
 * 本组件用 `<style scoped>` 把 `.btn` 一套完整复刻下来，互不干扰。
 */
import { onBeforeUnmount, ref, watchEffect } from 'vue'

import { useDevModal } from '@/composables/useDevModal'

const { mounted, open, closeModal, setModalRoot } = useDevModal()

/** 弹窗根节点，供焦点陷阱在运行时定位 */
const rootRef = ref<HTMLElement | null>(null)

// `rootRef` 由 `v-if` 控制存在性，打开/关闭时值会变，需要同步给控制器
watchEffect(() => {
  setModalRoot(rootRef.value)
})

onBeforeUnmount(() => {
  setModalRoot(null)
})
</script>

<template>
  <div
    v-if="mounted"
    ref="rootRef"
    class="modal"
    :class="{ 'is-open': open }"
    :aria-hidden="open ? 'false' : 'true'"
    @click.self="closeModal"
  >
    <section
      class="modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
      aria-describedby="dev-modal-desc"
    >
      <button class="modal-close" type="button" aria-label="关闭" @click="closeModal">×</button>

      <!-- 右上角蝴蝶：纯装饰，动画依赖 `.wing` 类，故内联而非抽成图标组件 -->
      <span class="modal-bfly" aria-hidden="true">
        <svg viewBox="0 0 44 44" fill="currentColor">
          <g class="wing l">
            <path
              d="M21.6 21.1C16.9 11.4 8.9 6.3 4.9 10.1 1.2 13.6 5.2 20.5 15.7 21.9 6.7 23.3 4.6 30.3 8.6 33.3c3.9 2.9 9.3-2.8 12.4-11.1Z"
            />
          </g>
          <g class="wing r">
            <path
              d="M22.4 21.1c4.7-9.7 12.7-14.8 16.7-11 3.7 3.5-.3 10.4-10.8 11.8 9 1.4 11.1 8.4 7.1 11.4-3.9 2.9-9.3-2.8-12.4-11.1Z"
            />
          </g>
          <path
            d="M21.6 15.6c1.2 0 1.9 1.5 1.5 3.8l-.8 5.6c-.2 1.4-1 1.4-1.2 0l-.8-5.6c-.4-2.3.3-3.8 1.3-3.8Z"
          />
        </svg>
      </span>

      <div class="kicker"><i>✦</i> FIREFLY.LOVE · DEVELOPMENT</div>

      <h2 id="dev-modal-title">这里的星光，<em>还在等待点亮。</em></h2>

      <p class="modal-lead" id="dev-modal-desc">
        流萤.love
        目前仍在筹备中。站长很喜欢流萤，也很想把这个小小的同好网站认真做好，但目前个人时间和能力有限，暂时没有足够精力和技术独立完成全部开发。
      </p>
      <p class="modal-lead">所以，想邀请同样喜欢流萤的你，一起把这个想法变成真正的网站。</p>

      <div class="divider"></div>

      <ul class="reqs">
        <li>
          <span class="check">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m4.5 12.5 5 5 10-11" />
            </svg>
          </span>
          <span>
            <b>真心喜欢流萤</b>
            <small>愿意一起维护一个友善、用心的同好空间。</small>
          </span>
        </li>
        <li>
          <span class="check">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m4.5 12.5 5 5 10-11" />
            </svg>
          </span>
          <span>
            <b>有一定的开发基础</b>
            <small>前端、后端、UI 设计或其他相关能力都欢迎。</small>
          </span>
        </li>
        <li>
          <span class="check">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m4.5 12.5 5 5 10-11" />
            </svg>
          </span>
          <span>
            <b>一起规划与共建</b>
            <small>从角色档案、壁纸图集到同人内容，逐步完善网站。</small>
          </span>
        </li>
      </ul>

      <p class="server-note">
        ✧　可供团队使用 <b>流萤.love 域名</b> 与 <b>云服务器</b>，希望找到愿意共同维护项目的小伙伴。
      </p>

      <div class="modal-actions">
        <a
          class="btn btn-primary"
          href="https://qm.qq.com/q/guZg2hdNE4"
          target="_blank"
          rel="noopener noreferrer"
        >
          加入 QQ 群聊
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M8 16 16.5 7.5M9.5 7.5h7v7" />
          </svg>
        </a>
        <button class="btn btn-ghost" type="button" @click="closeModal">我先看看</button>
      </div>

      <p class="modal-foot">这是一个非官方同人项目，与《崩坏：星穹铁道》官方无关。</p>
    </section>
  </div>
</template>

<style scoped>
/* ============================================================
   开发窗口 —— 移植自 1.html:1959-2166
   ============================================================ */

/* 与 `1.html` 的唯一差异：原稿用 `display:none` + `.is-visible { display:grid }`
   控制显隐，这里改由 `v-if` 决定节点是否存在，因此 `display` 直接固定为 grid。
   好处是关闭过渡结束后节点真正离开 DOM，不会残留一个几乎透明的全屏遮罩层
   拦截下方页面的点击。 */
.modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 22px;
  background: rgba(2, 7, 17, 0.74);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  opacity: 0;
  transition: opacity 0.26s ease;
}

.modal.is-open {
  opacity: 1;
}

.modal-card {
  position: relative;
  width: min(560px, 100%);
  max-height: min(92vh, 860px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 38px 38px 30px;
  border-radius: 24px;
  border: 1px solid rgba(178, 212, 255, 0.36);
  background:
    radial-gradient(ellipse at 88% -4%, rgba(76, 116, 182, 0.26), transparent 46%),
    radial-gradient(ellipse at 4% 104%, rgba(96, 80, 180, 0.2), transparent 46%),
    linear-gradient(152deg, #122544, #081428 74%);
  box-shadow:
    0 40px 110px rgba(0, 0, 0, 0.6),
    inset 0 1px rgba(255, 255, 255, 0.06);
  transform: translateY(18px) scale(0.97);
  opacity: 0;
  transition:
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.34s;
}

.modal.is-open .modal-card {
  transform: none;
  opacity: 1;
}

/* 卡片顶缘的一道细高光 */
.modal-card::before {
  content: '';
  position: absolute;
  left: 8%;
  right: 8%;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 228, 255, 0.7), transparent);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  cursor: pointer;
  color: #c8d9f2;
  border: 1px solid rgba(178, 208, 255, 0.24);
  background: rgba(255, 255, 255, 0.04);
  font-size: 22px;
  line-height: 1;
  transition:
    background 0.24s,
    transform 0.3s,
    color 0.24s;
}

.modal-close:hover {
  background: rgba(204, 225, 255, 0.16);
  color: #fff;
  transform: rotate(90deg);
}

.modal-bfly {
  position: absolute;
  right: 80px;
  top: 31px;
  width: 40px;
  height: 34px;
  color: #dcebff;
  opacity: 0.5;
  animation: box-float-y 7s ease-in-out infinite;
  pointer-events: none;
}

.modal-bfly .wing {
  transform-origin: 22px 22px;
  animation: box-wing-idle 5s ease-in-out infinite;
}

/* 与原稿 `.kicker` 同名，但 scoped 隔离，不会影响页面其它段 */
.kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(156, 197, 255, 0.24);
  background: rgba(139, 184, 246, 0.11);
  color: #bcdcff;
  font-size: 10.5px;
  letter-spacing: 0.16em;
}

.kicker i {
  font-style: normal;
  animation: box-spark-pulse 3s ease-in-out infinite;
}

.modal-card h2 {
  margin: 20px 0 12px;
  font-size: clamp(22px, 3.6vw, 27px);
  line-height: 1.45;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.modal-card h2 em {
  font-family: var(--f-display);
  font-style: italic;
  font-weight: 400;
  color: #cfe2ff;
}

.modal-lead {
  margin: 0 0 12px;
  color: #c3d4ec;
  font-size: 13.5px;
  line-height: 1.95;
}

.divider {
  height: 1px;
  margin: 22px 0;
  background: linear-gradient(90deg, rgba(178, 211, 255, 0.42), rgba(178, 211, 255, 0.03));
}

.reqs {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.reqs li {
  display: flex;
  gap: 12px;
  color: #cfdef4;
  font-size: 13px;
  line-height: 1.75;
}

.reqs b {
  color: #eaf3ff;
}

.reqs small {
  display: block;
  color: #9fb4d4;
  font-size: 12.5px;
  margin-top: 2px;
}

.check {
  width: 24px;
  height: 24px;
  flex: none;
  display: grid;
  place-items: center;
  margin-top: 1px;
  border-radius: 8px;
  background: rgba(166, 208, 255, 0.13);
  color: #cbe5ff;
}

.check svg {
  width: 13px;
  height: 13px;
}

.server-note {
  margin: 22px 0;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 12.5px;
  line-height: 1.85;
  color: #aec2df;
  border: 1px solid rgba(154, 194, 248, 0.18);
  background: rgba(118, 163, 225, 0.08);
}

.server-note b {
  color: #d8e8ff;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions .btn {
  flex: 1;
  height: 48px;
  justify-content: center;
  font-size: 14.5px;
}

.modal-foot {
  margin: 16px 0 0;
  color: #7187aa;
  font-size: 11.5px;
  line-height: 1.7;
  text-align: center;
}

/* ---------- 按钮 ----------
   `.btn` 在 `1.html` 里是全局类，与本页 Hero 共用。迁移后 Hero 的 `.btn`
   已随 `HeroSection` 收进各自 scoped 作用域，本组件需要完整的一套，
   故在此复刻（`1.html:832-895` 的按钮段）。 */

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid rgba(180, 212, 255, 0.4);
  background: rgba(15, 32, 60, 0.6);
  color: #eaf3ff;
  font-size: 14px;
  letter-spacing: 0.06em;
  transition:
    transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.26s,
    border-color 0.26s,
    background 0.26s;
}

.btn:hover {
  transform: translateY(-2px);
  border-color: rgba(214, 235, 255, 0.85);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.35),
    0 0 26px rgba(130, 180, 255, 0.28);
}

.btn:active {
  transform: translateY(0) scale(0.985);
}

.btn svg {
  width: 17px;
  height: 17px;
  flex: none;
}

/* 悬停时的斜向扫光 */
.btn::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -60%;
  width: 45%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.42), transparent);
  transform: skewX(-18deg);
  transition: left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn:hover::after {
  left: 115%;
}

.btn-primary {
  color: #0d1c36;
  border-color: rgba(233, 244, 255, 0.9);
  background: linear-gradient(112deg, #ffffff 0%, #eaf2ff 34%, #c3daff 100%);
  box-shadow:
    0 10px 30px rgba(10, 30, 60, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.btn-primary:hover {
  background: linear-gradient(112deg, #fff, #f2f7ff 40%, #d3e5ff);
  box-shadow:
    0 16px 40px rgba(10, 30, 60, 0.5),
    0 0 30px rgba(170, 210, 255, 0.5);
}

.btn-primary::after {
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.9), transparent);
}

.btn-ghost {
  background: rgba(12, 26, 50, 0.5);
}

/* ---------- 动效 ----------
   原稿的 `floatY` / `wingIdle` / `sparkPulse` 是全局 keyframes，迁移后各组件
   各自持有一份（`float-y` / `wing-idle` / `spark-pulse`）。scoped 样式里
   同名 keyframes 会与全局互相覆盖，故统一加 `box-` 前缀隔离。 */

@keyframes box-float-y {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-9px) rotate(3deg);
  }
}

@keyframes box-wing-idle {
  0%,
  72%,
  100% {
    transform: scaleX(1);
  }

  82% {
    transform: scaleX(0.72);
  }

  90% {
    transform: scaleX(0.94);
  }
}

@keyframes box-spark-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.95;
  }

  50% {
    transform: scale(1.14) rotate(90deg);
    opacity: 1;
  }
}

/* ============================================================
   响应式 —— 移植自 1.html:2829-2867
   ============================================================ */

@media (max-width: 860px) {
  .modal {
    padding: 12px;
  }

  .modal-card {
    width: 100%;
    max-height: calc(100dvh - 24px);
    padding: 30px 22px 24px;
    border-radius: 20px;
  }

  .modal-bfly {
    display: none;
  }

  .modal-card h2 {
    margin-top: 16px;
  }

  .modal-lead {
    font-size: 12.5px;
    line-height: 1.85;
  }

  .divider {
    margin: 18px 0;
  }

  .reqs {
    gap: 11px;
  }

  .reqs li {
    font-size: 12.5px;
  }

  .server-note {
    margin: 18px 0;
    font-size: 12px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
    height: 46px;
  }
}
</style>
