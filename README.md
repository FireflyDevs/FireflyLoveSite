<div align="center">

# FireflyLoveSite

[![CI](https://github.com/FireflyDevs/FireflyLoveSite/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/FireflyDevs/FireflyLoveSite/actions/workflows/ci.yml)

一个尚在筹备中的非官方《崩坏：星穹铁道》流萤主题同好网站。

[项目域名](https://xn--qzw410c.love) · [开发预览](https://dev.xn--qzw410c.love) · [GitHub 仓库](https://github.com/FireflyDevs/FireflyLoveSite) · [提交 Issue](https://github.com/FireflyDevs/FireflyLoveSite/issues) · [加入 QQ 群](https://qm.qq.com/q/guZg2hdNE4)

</div>

---

## 关于这个项目

`FireflyLoveSite` 是 **流萤.love** 的网站源码，由 [FireflyDevs（流萤的秘密基地）](https://github.com/FireflyDevs) 维护。它面向所有喜欢流萤、喜欢《崩坏：星穹铁道》的玩家，希望做成一个友善、用心、可以长期维护的同好空间。

目前网站仍在筹备中，页面内容不是最终版本，允许大幅度重构，欢迎大家一起补充和改造。当前允许所有人[参与开发dev分支](./#分支与自动部署)，dev分支在[dev.流萤.love](https://dev.流萤.love)实时更新显示。

> 「不、不好意思！请帮帮我……」
>
> 「保护美少女我义不容辞！」

这是一个**非官方同人项目**，与米哈游 / HoYoverse 官方无关。



## 本地开发

需要 Node.js `^22.18.0 || >=24.12.0`（见 `package.json` 的 `engines` 字段）。

```bash
git clone https://github.com/FireflyDevs/FireflyLoveSite.git
cd FireflyLoveSite
pnpm install
pnpm dev
```

然后打开终端提示的地址（默认 `http://127.0.0.1:5173/`）。

常用命令：

```bash
pnpm dev          # 启动开发服务器（热更新）
pnpm type-check   # vue-tsc 类型检查
pnpm build        # 类型检查 + 生产构建，输出到 dist/
pnpm preview      # 本地预览构建产物
pnpm format       # 用 Prettier 格式化 src/
```

仓库使用 pnpm 并提交了 `pnpm-lock.yaml`，请优先使用 `pnpm`。

> 注意：`pnpm preview` 与 Vite 开发服务器都会对未知路径回退到 `index.html`，所以子路由在本地可以正常刷新。部署到静态服务器时**必须**配置同样的回退规则，否则直接访问 `/characters` 等地址会 404，详见 [DEPLOYMENT.md](DEPLOYMENT.md)。



## 目录结构

```text
FireflyLoveSite/
├── .github/
│   ├── scripts/ci-check.sh        # CI 站点检查脚本
│   └── workflows/                 # CI 与自动合并工作流
├── public/
│   └── favicon.ico                # 原样拷贝到构建产物根目录
├── src/
│   ├── assets/
│   │   ├── ff/                    # 页面图片素材
│   │   ├── fonts/                 # 自定义字体（woff2）
│   │   ├── hero.jpg               # 首屏主视觉
│   │   └── main.css               # 全局样式、@font-face 与 CSS 变量
│   ├── components/
│   │   ├── icons/                 # 图标组件（全部跟随 currentColor）
│   │   ├── layout/                # 顶栏、页脚、移动端底栏、开发弹窗
│   │   └── sections/              # 首页区块
│   ├── composables/               # 组合式函数（涟漪、入场动画、弹窗委托等）
│   ├── router/index.ts            # 路由表与跳转规则
│   ├── views/                     # 页面组件
│   ├── App.vue                    # 根组件（全站布局）
│   └── main.ts                    # 应用入口
├── index.html                     # Vite HTML 模板
├── vite.config.ts
├── tsconfig*.json
├── package.json
├── README.md
└── DEPLOYMENT.md                  # 部署与运维说明
```



## 分支与自动部署

| 分支 | 用途 | 地址 |
| --- | --- | --- |
| `main` | 生产分支 | https://流萤.love |
| `dev` | 开发集成分支，所有 PR 的目标分支 | https://dev.流萤.love |

工作流程：

1. 从 `dev` 创建功能分支，提交 Pull Request 到 `dev`
2. GitHub Actions 自动运行类型检查与站点检查
3. 团队成员发起的 PR 在检查通过后自动压缩合并到 `dev`
4. 外部贡献者的 PR 会先运行检查，由维护者审核后合并
5. 合并后服务器自动部署到 https://dev.流萤.love

`main` 只接收经过验证的发布内容，功能开发请统一提交到 `dev`。



## 参与贡献

**所有人都可以参与这个项目。** 无论你是开发者、设计师、写作者、测试者，还是只想帮忙整理资料，都欢迎加入。
**当前项目中的内容并不是最终目标**，可以当成一个占位，用来显示招募信息，没有开发方向限制。

### 提交 PR

1. Fork 本仓库
2. 从 `dev` 创建分支：

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature
   ```

3. 完成修改并本地测试：

   ```bash
   pnpm dev
   pnpm type-check
   pnpm build
   ```

4. 提交并推送：

   ```bash
   git add .
   git commit -m "feat: describe your change"
   git push origin feature/your-feature
   ```

5. 在 GitHub 提交 Pull Request，**目标分支选择 `dev`**，说明修改内容、测试方式和相关 Issue

较大的功能建议先开 Issue 讨论，避免重复开发或方向不一致。

### 加入开发团队

如果你愿意长期参与维护，可以通过以下方式申请：

1. 在 GitHub 提交一个 Issue，标题写「申请加入开发团队」
2. 简单介绍：
   - 你的 GitHub 用户名
   - 你擅长的方向（前端 / UI 设计 / 内容整理 / 测试等）
   - 每周大概能投入的时间
   - 你想参与的部分
3. 也可以直接加入页面中的 [QQ 群](https://qm.qq.com/q/guZg2hdNE4) 联系维护者

维护者会根据项目需要和你的意愿，邀请你加入仓库协作或开发团队。

### 可以贡献什么

- 前端页面、交互和响应式适配（Vue 组件）
- UI / 视觉 / 动效设计
- 流萤角色资料、活动资料、图集和视频整理
- 壁纸、同人内容、周边信息的收录与校对
- 构建、部署与性能优化
- 文案、翻译、无障碍和移动端体验
- 测试、Issue 整理和新人答疑

### PR 注意事项

- PR 目标分支必须是 `dev`，不要直接提交到 `main`
- 团队成员 PR 在 CI 通过后自动合并；外部 PR 会等待维护者审核
- 一次 PR 尽量只做一件事，保持改动清晰
- 不提交密钥、Token、服务器密码等敏感信息
- 新功能请同步更新 README 或相关文档
- 图片和游戏素材请确认来源与授权，尊重原作者和官方版权
- 提交前至少运行一次 `pnpm type-check` 与 `pnpm build`，确认类型检查与构建通过

## 版权与免责声明

- 本项目是非官方同人项目，与米哈游 / HoYoverse 及《崩坏：星穹铁道》官方无关。
- 游戏角色、官方图片、音乐、视频等素材版权归原权利人所有。
- 贡献素材前请确认来源与使用授权；如权利人提出要求，维护者会及时处理。
- 代码部分的开源许可证尚未最终确定，欢迎维护团队共同讨论后补充。

---

如果这个项目让你想起了那片星空，欢迎点一个 Star，或者直接加入我们一起把它做完。
