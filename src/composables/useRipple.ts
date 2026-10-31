import { onBeforeUnmount, type Ref } from 'vue'

/**
 * 点击涟漪。
 *
 * 移植自 `1.html` 的「涟漪」段：`pointerdown` 时在命中点生成一个按比例放大的
 * 圆形光斑，由 CSS `.ripple` 负责扩散与淡出，640ms 后从 DOM 移除。
 *
 * 与原稿的差异：原稿用 `querySelectorAll` 一次性绑定，新增节点不会生效；
 * 这里由宿主元素显式订阅，事件归属清晰，也便于组件卸载时回收定时器。
 */

/** 光斑生命周期（ms），与 `main.css` 里 `.ripple` 的 `ripple-out` 时长一致 */
const RIPPLE_LIFETIME = 640

/** 光斑半径相对宿主最长边的倍数（原稿取 2.1 倍直径） */
const RIPPLE_SCALE = 2.1

/**
 * 让宿主元素具备涟漪反馈。
 *
 * @param target 宿主元素，通常就是接收点击的按钮 / 卡片 / 链接
 * @param shouldSkip 返回 `true` 时本次不画涟漪（如用户偏好降低动效）
 * @returns `pointerdown` 处理函数，挂到宿主的 `@pointerdown` 上
 */
export function useRipple(
  target: Readonly<Ref<HTMLElement | null>>,
  shouldSkip: () => boolean,
): (event: PointerEvent) => void {
  /** 尚未移除的光斑定时器，卸载时统一清理 */
  const timers = new Set<number>()

  /** 移除某个光斑并注销其定时器 */
  const removeRipple = (node: HTMLElement, timer: number): void => {
    timers.delete(timer)
    node.remove()
  }

  const onPointerDown = (event: PointerEvent): void => {
    if (shouldSkip()) return

    const host = target.value
    if (!host) return

    const rect = host.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * RIPPLE_SCALE

    // 宿主是 static 定位时补成 relative，光斑才能相对它定位
    if (window.getComputedStyle(host).position === 'static') {
      host.style.position = 'relative'
    }

    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${event.clientX - rect.left}px`
    ripple.style.top = `${event.clientY - rect.top}px`
    host.appendChild(ripple)

    const timer = window.setTimeout(() => removeRipple(ripple, timer), RIPPLE_LIFETIME)
    timers.add(timer)
  }

  // 卸载时清掉未到期的定时器，避免回调操作已脱离文档的节点
  onBeforeUnmount(() => {
    timers.forEach((timer) => window.clearTimeout(timer))
    timers.clear()
  })

  return onPointerDown
}
