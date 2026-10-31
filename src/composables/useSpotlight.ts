import { onBeforeUnmount, type Ref } from 'vue'

/**
 * 面板光斑跟随。
 *
 * 移植自 `1.html` 的「卡片光斑跟随」段：鼠标在 `.panel` 上移动时，
 * 把当前坐标写入 `--mx` / `--my` CSS 变量，供 `::after` 伪元素的
 * radial-gradient 以该点为圆心绘制光晕。
 *
 * 与原稿的差异：原稿全局 `querySelectorAll('.panel')` 一次性绑定；
 * 这里由每个面板组件显式订阅，卸载时无残留监听。
 *
 * @param target 宿主面板元素
 */
export function useSpotlight(target: Readonly<Ref<HTMLElement | null>>): void {
  const onPointerMove = (event: PointerEvent): void => {
    const host = target.value
    if (!host) return
    const rect = host.getBoundingClientRect()
    host.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    host.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  const attach = (): void => {
    target.value?.addEventListener('pointermove', onPointerMove)
  }

  // 等 DOM 就绪再挂监听
  if (target.value) attach()
  else {
    // 在 setup 阶段 ref 可能还未填充，用微任务兜底
    queueMicrotask(attach)
  }

  onBeforeUnmount(() => {
    target.value?.removeEventListener('pointermove', onPointerMove)
  })
}
