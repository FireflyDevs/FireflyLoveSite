/**
 * 图标组件统一出口。
 *
 * 全部组件由原 `1.html` 的 55 处内联 `<svg>` 去重而来。
 * 同一图形的不同描边/填充形式合并为单个组件的 `variant` 变体，
 * 共 23 个组件，覆盖 32 个唯一图形。
 *
 * 用法：
 *   import { IconHome, IconArrow, iconMap, type IconName } from '@/components/icons'
 *
 *   <IconHome :size="18" class="tab-home" />
 *   <IconArrow variant="simple" />        // 选择变体
 *   <component :is="iconMap[name]" />      // 按名字动态渲染
 *
 * 共同 props：
 *   - `variant`  图形变体（各组件允许值不同，见组件内注释）
 *   - `size`     尺寸（px），默认 24
 *   - `hidden`   是否对读屏隐藏，纯装饰时保持 true（默认）
 *
 * 所有图形跟随 `currentColor`，根节点带 `icon icon-<name>` 类名钩子。
 */

import type { FunctionalComponent } from 'vue'

import IconArrow from './IconArrow.vue'
import IconBook from './IconBook.vue'
import IconButterfly from './IconButterfly.vue'
import IconCheck from './IconCheck.vue'
import IconChevron from './IconChevron.vue'
import IconComment from './IconComment.vue'
import IconExternal from './IconExternal.vue'
import IconGithub from './IconGithub.vue'
import IconHeart from './IconHeart.vue'
import IconHome from './IconHome.vue'
import IconImage from './IconImage.vue'
import IconLink from './IconLink.vue'
import IconMenu from './IconMenu.vue'
import IconPlay from './IconPlay.vue'
import IconSearch from './IconSearch.vue'
import IconSpark from './IconSpark.vue'
import IconStar from './IconStar.vue'
import IconTheme from './IconTheme.vue'
import IconUnderline from './IconUnderline.vue'
import IconUser from './IconUser.vue'
import IconVideo from './IconVideo.vue'
import IconWeChat from './IconWeChat.vue'
import IconYoutube from './IconYoutube.vue'

export {
  IconArrow,
  IconBook,
  IconButterfly,
  IconCheck,
  IconChevron,
  IconComment,
  IconExternal,
  IconGithub,
  IconHeart,
  IconHome,
  IconImage,
  IconLink,
  IconMenu,
  IconPlay,
  IconSearch,
  IconSpark,
  IconStar,
  IconTheme,
  IconUnderline,
  IconUser,
  IconVideo,
  IconWeChat,
  IconYoutube,
}

/**
 * 图标组件的公共类型。
 *
 * 所有图标都是同样的 SFC 结构：`variant` + `size` + `hidden` 三个 props，
 * 根节点为 `<svg>`。这里用结构化接口描述契约，避免 vue-tsc 在联合类型上报错。
 */
export interface IconComponentProps {
  /** 图形变体，各组件允许值不同 */
  variant?: string
  /** 尺寸（px），同时写入 width/height */
  size?: number | string
  /** 是否对辅助技术隐藏，纯装饰时保持 true */
  hidden?: boolean
}

/** 图标组件的公共签名 */
export type IconComponent = FunctionalComponent<IconComponentProps>

/** 图标组件字典，便于按名字动态渲染（如 `<component :is="iconMap[name]" />`） */
export const iconMap = {
  arrow: IconArrow,
  book: IconBook,
  butterfly: IconButterfly,
  check: IconCheck,
  chevron: IconChevron,
  comment: IconComment,
  external: IconExternal,
  github: IconGithub,
  heart: IconHeart,
  home: IconHome,
  image: IconImage,
  link: IconLink,
  menu: IconMenu,
  play: IconPlay,
  search: IconSearch,
  spark: IconSpark,
  star: IconStar,
  theme: IconTheme,
  underline: IconUnderline,
  user: IconUser,
  video: IconVideo,
  wechat: IconWeChat,
  youtube: IconYoutube,
} satisfies Record<string, unknown>

/** 图标名联合类型，供动态选图标时收窄 */
export type IconName = keyof typeof iconMap

/**
 * 各组件的可用变体清单。
 *
 * 用于预览页渲染与文档生成；单变体组件的列表只有一项。
 */
export const iconVariants = {
  arrow: ['normal', 'simple'],
  book: ['normal'],
  butterfly: ['full', 'simple', 'ico'],
  check: ['normal'],
  chevron: ['normal'],
  comment: ['normal'],
  external: ['normal'],
  github: ['normal'],
  heart: ['solid', 'outline'],
  home: ['normal', 'small'],
  image: ['normal'],
  link: ['normal'],
  menu: ['normal'],
  play: ['normal'],
  search: ['normal', 'bold', 'thin'],
  spark: ['normal'],
  star: ['normal'],
  theme: ['normal'],
  underline: ['normal'],
  user: ['normal'],
  video: ['normal', 'solid'],
  wechat: ['normal'],
  youtube: ['normal'],
} as const satisfies Record<IconName, readonly string[]>
