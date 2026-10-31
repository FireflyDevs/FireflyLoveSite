import { nextTick, ref, type Ref } from 'vue'

/**
 * 「开发窗口」弹窗的开合状态与无障碍行为。
 *
 * 移植自 `1.html` 的「开发窗口」段（`1.html:3861-3921`）。原稿用
 * `querySelectorAll('[data-modal]')` 一次性绑定点击，并通过手工增删
 * `.is-visible` / `.is-open` / `aria-hidden` 三个属性来表达状态。这里改成
 * 响应式状态驱动，Vue 负责把状态映射到 DOM，消除 DOM class 与 JS 变量
 * 两处状态不同步的可能。
 *
 * ## 为什么是单例
 *
 * 全站约 30 个按钮（顶栏、页脚、移动端底栏、Hero、新闻卡、快捷入口）都带
 * `data-modal`，而真正承载弹窗的只有 `App.vue` 里的一个 `DevModal`。
 * 开合状态必须全站唯一，所以状态放在模块作用域，`useDevModal()` 每次返回
 * 同一份控制器。
 *
 * ## 生命周期三阶段
 *
 * ```
 * 初始          mounted=false, open=false   → 未插入 DOM
 * 打开瞬间      mounted=true,  open=false   → display:grid 但 opacity:0
 * 下一帧        mounted=true,  open=true    → 叠加 is-open，过渡播放
 * 关闭瞬间      mounted=true,  open=false   → 过渡反向播放
 * 280ms 后      mounted=false, open=false   → 移出 DOM
 * ```
 *
 * 关闭过渡期间必须保持挂载，否则 `display:none` 会让过渡直接跳变。
 */

/** 关闭过渡时长（ms）。`.modal` 的 `transition: opacity 0.26s`，留 20ms 余量 */
const CLOSE_DURATION = 280

/** 打开后把焦点交给关闭按钮的延时（ms）。等首帧绘制完成，否则焦点落空 */
const FOCUS_DELAY = 40

/** 焦点陷阱候选元素，与原稿的 `FOCUSABLE` 选择器一致 */
const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

/** 弹窗开合控制器 */
export interface DevModalController {
  /** 是否已插入 DOM（关闭过渡期间仍为 `true`） */
  mounted: Readonly<Ref<boolean>>
  /** 是否处于打开态，对应 CSS 的 `is-open` */
  open: Readonly<Ref<boolean>>
  /** 打开弹窗，并记录当前焦点以便关闭后归还 */
  openModal: () => void
  /** 关闭弹窗，过渡结束后卸载并归还焦点 */
  closeModal: () => void
  /** 由 `DevModal` 登记根节点，焦点陷阱需要它才知道弹窗在哪 */
  setModalRoot: (root: HTMLElement | null) => void
}

/* ---------------- 单例状态 ---------------- */

const mounted = ref(false)
const open = ref(false)

/** 打开前的活动元素，关闭后把焦点还回去 */
let lastFocused: HTMLElement | null = null

/** 关闭过渡的定时器句柄 */
let closeTimer: number | null = null

/** 弹窗根节点，由 `DevModal` 注册 */
let modalRoot: HTMLElement | null = null

/** 文档级键盘监听是否已注册 */
let listenersReady = false

/**
 * 打开请求的世代号。
 *
 * 用来化解「打开动画未完成就被关闭」的竞态：`openModal` 会 `await nextTick()`
 * 再推进到 `is-open`，若这期间用户已触发关闭，世代号已经变化，延迟的回调
 * 直接作废，不会把刚关掉的弹窗又点亮一次。
 */
let openGeneration = 0

/* ---------------- 内部实现 ---------------- */

const clearCloseTimer = (): void => {
  if (closeTimer === null) return
  window.clearTimeout(closeTimer)
  closeTimer = null
}

/**
 * 键盘处理：Esc 关闭；Tab 在弹窗内循环。
 *
 * 注册在 `document` 而非弹窗上——焦点可能短暂落在 `body`（如点击遮罩边缘后），
 * 挂在弹窗内的监听会收不到事件。
 */
const onDocumentKeydown = (event: KeyboardEvent): void => {
  if (!open.value) return

  if (event.key === 'Escape') {
    closeModal()
    return
  }

  if (event.key !== 'Tab' || !modalRoot) return

  // `offsetParent === null` 会同时滤掉 `display:none` 的元素，与原稿的可见性过滤一致
  const items = [...modalRoot.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (node) => node.offsetParent !== null,
  )
  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/**
 * 惰性注册文档监听。
 *
 * 不在模块顶层直接注册，一是避免非浏览器环境（构建期、测试）报错，
 * 二是没有打开过弹窗的访问者不必付出常驻监听的代价。
 */
const ensureListeners = (): void => {
  if (listenersReady || typeof document === 'undefined') return
  document.addEventListener('keydown', onDocumentKeydown)
  listenersReady = true
}

/**
 * 打开弹窗。
 *
 * 时序依赖 `nextTick`：`mounted` 置真只会让 Vue 在**下一次刷新**时插入节点，
 * 此刻元素的 `opacity` 初始值尚未被浏览器认定，若同帧就加上 `is-open`，
 * 样式表里 `opacity: 0 → 1` 的过渡会被跳过（浏览器认为起始值就是 1）。
 */
const openModal = (): void => {
  ensureListeners()
  clearCloseTimer()

  const generation = ++openGeneration

  lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
  mounted.value = true
  document.body.classList.add('modal-open')

  void nextTick().then(() => {
    if (generation !== openGeneration) return
    // 再等一帧：nextTick 之后节点已在 DOM，但 reflow 尚未发生
    window.requestAnimationFrame(() => {
      if (generation !== openGeneration) return
      open.value = true
    })
  })

  window.setTimeout(() => {
    if (generation !== openGeneration) return
    modalRoot?.querySelector<HTMLElement>('.modal-close')?.focus({ preventScroll: true })
  }, FOCUS_DELAY)
}

/**
 * 关闭弹窗。
 *
 * 判定用 `mounted` 而不是 `open`：打开动画的第一帧里 `open` 仍是 `false`，
 * 若以此早退，这段窗口期内用户点关闭将完全无响应。
 */
const closeModal = (): void => {
  if (!mounted.value) return

  // 作废尚未执行的打开回调
  openGeneration += 1
  clearCloseTimer()

  open.value = false
  document.body.classList.remove('modal-open')

  closeTimer = window.setTimeout(() => {
    closeTimer = null
    mounted.value = false
    lastFocused?.focus({ preventScroll: true })
    lastFocused = null
  }, CLOSE_DURATION)
}

const setModalRoot = (root: HTMLElement | null): void => {
  modalRoot = root
}

/* ---------------- 对外接口 ---------------- */

const controller: DevModalController = {
  mounted,
  open,
  openModal,
  closeModal,
  setModalRoot,
}

/** 获取全局唯一的开发窗口控制器 */
export function useDevModal(): DevModalController {
  return controller
}

/**
 * 让页面上全部 `[data-modal]` 元素都能唤起开发窗口。
 *
 * 原稿用 `querySelectorAll` 一次性绑定；Vue 场景下元素由各组件模板渲染，
 * 新增与销毁时机都不固定，因此在 `document` 上做事件委托：一个监听覆盖全站，
 * 各 `data-modal` 按钮所在组件无需改动一行代码。
 *
 * @returns 清理函数，在 `App.vue` 卸载时调用
 */
export function installDevModalTrigger(): () => void {
  const findTrigger = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof Element)) return null
    return target.closest<HTMLElement>('[data-modal]')
  }

  /**
   * 原生 `<button>` / `<a>` 的 Enter/Space 会自行派发 click，这里再处理
   * 就会重复触发；只有非原生可聚焦元素（如 `div[tabindex]`）需要兜底。
   */
  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const trigger = findTrigger(event.target)
    if (!trigger) return
    if (trigger.tagName === 'BUTTON' || trigger.tagName === 'A') return
    event.preventDefault()
    openModal()
  }

  const onClick = (event: MouseEvent): void => {
    if (!findTrigger(event.target)) return
    event.preventDefault()
    openModal()
  }

  document.addEventListener('click', onClick)
  document.addEventListener('keydown', onKeydown)

  return () => {
    document.removeEventListener('click', onClick)
    document.removeEventListener('keydown', onKeydown)
  }
}
