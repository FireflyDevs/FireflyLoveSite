import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Vue 侧的 `matchMedia` 监听句柄 */
interface MotionQuery {
  media: MediaQueryList
  /** 媒体查询变化时同步到 `prefersReduced` */
  onChange: (event: MediaQueryListEvent) => void
}

/**
 * 跟随系统的「降低动效」偏好。
 *
 * 页面上所有 JS 侧动效（视差、萤火粒子、涟漪、入场）都以它为总开关：
 * 用户开启该系统选项后，这些效果整体停用，只保留静态布局。
 *
 * - `SSR` 安全：`window` 不存在时返回常量 `true`，即按「不动」处理。
 * - 初始值同步读取一次，避免首帧动画闪一下。
 * - 运行期切换系统偏好也会实时生效（`change` 事件）。
 *
 * @returns 只读的 `Ref<boolean>`，`true` 表示应降低动效
 */
export function useReducedMotion(): Readonly<Ref<boolean>> {
  const prefersReduced = ref(true)
  let query: MotionQuery | null = null

  // 必须在组件作用域内调用：onMounted / onBeforeUnmount 依赖当前实例
  onMounted(() => {
    if (typeof window.matchMedia !== 'function') {
      prefersReduced.value = false
      return
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event: MediaQueryListEvent): void => {
      prefersReduced.value = event.matches
    }

    prefersReduced.value = media.matches
    media.addEventListener('change', onChange)
    query = { media, onChange }
  })

  onBeforeUnmount(() => {
    query?.media.removeEventListener('change', query.onChange)
    query = null
  })

  return prefersReduced
}
