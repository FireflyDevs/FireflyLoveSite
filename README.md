<div align="center">

# FireflyLoveSite

**流萤.love — 愿你也能，找到属于自己的光。**

一个尚在筹备中的非官方《崩坏：星穹铁道》流萤主题同好网站。

[项目域名](https://xn--qzw410c.love) · [GitHub 仓库](https://github.com/XingYunStar/FireflyLoveSite) · [提交 Issue](https://github.com/XingYunStar/FireflyLoveSite/issues) · [加入 QQ 群](https://qm.qq.com/q/guZg2hdNE4)

</div>

---

## 关于这个项目

`FireflyLoveSite` 是 **流萤.love** 的网站源码。它面向所有喜欢流萤、喜欢《崩坏：星穹铁道》的玩家，希望做成一个友善、用心、可以长期维护的同好空间。

目前网站还在筹备和持续完善中。页面里的流萤主题首页、角色内容、壁纸与同人内容入口已经搭好基础，接下来会逐步补充角色档案、图集、视频、资料库和更多社区内容。

> 「我会把这份温柔，一直带给你。」
>
> 愿你也能，找到属于自己的光。

这是一个**非官方同人项目**，与米哈游 / HoYoverse 官方无关。

## firefly.html 里有什么

`firefly.html` 是网站默认页面，也是目前视觉和内容的主体。它包含：

- **首屏**：流萤主题视觉、`Firefly` / `流萤` 中英文标识、角色寄语与「进入她的世界」入口
- **导航**：首页、角色介绍、图集、视频、资料库和搜索入口，移动端提供底部导航
- **最新动态**：角色故事、官方资讯、活动资讯、壁纸精选、同人作品等卡片
- **角色介绍**：流萤角色资料、图片壁纸、视频剪辑、同人创作、周边推荐
- **共建邀请**：「加入共建团队」弹窗，邀请喜欢流萤、愿意一起维护网站的人参与
- **页面细节**：响应式布局、星空/光点动画、中英文字体与内容交互
- **非官方声明**：明确项目与官方无关

网站使用 TypeScript + Node.js 提供服务，`firefly.html` 由 Node 服务作为默认页返回，同时支持可配置的 301/302 跳转。

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 页面 | HTML5 + CSS3 + 原生 JavaScript |
| 服务端 | TypeScript + Node.js（原生 HTTP，无运行时依赖） |
| 部署 | Nginx 反向代理 + systemd |
| 跳转 | `redirects.json` 配置，支持 301/302，保存后自动重载 |

当前服务器使用 Node.js 26，可以直接运行 `.ts` 文件，无需额外编译。

## 本地运行

需要 Node.js 24 或更高版本。

```bash
git clone https://github.com/XingYunStar/FireflyLoveSite.git
cd FireflyLoveSite
node server.ts
```

然后打开：

```text
http://127.0.0.1:3000/
```

默认会读取同目录下的 `firefly.html`。跳转规则在 `redirects.json` 中修改，服务会自动检测配置变化。

可选：安装开发依赖并做 TypeScript 类型检查（仓库包含 pnpm 锁文件，npm / pnpm 均可）：

```bash
pnpm install
pnpm typecheck

# 或者
npm install
npm run typecheck
```

## 目录结构

```text
FireflyLoveSite/
├── firefly.html          # 默认页面
├── server.ts             # TypeScript 网站服务
├── redirects.json        # 301/302 跳转规则
├── pic/ff/               # 页面图片素材
├── package.json
├── tsconfig.json
├── README.md
└── DEPLOYMENT.md         # 部署与运维说明
```

## 参与贡献

**所有人都可以参与这个项目。** 无论你是开发者、设计师、写作者、测试者，还是只想帮忙整理资料，都欢迎加入。

### 提交 PR

1. Fork 本仓库
2. 从 `main` 创建分支：

   ```bash
   git checkout -b feature/your-feature
   ```

3. 完成修改并本地测试：

   ```bash
   node server.ts
   ```

4. 提交并推送：

   ```bash
   git add .
   git commit -m "feat: describe your change"
   git push origin feature/your-feature
   ```

5. 在 GitHub 提交 Pull Request，说明修改内容、测试方式和相关 Issue

较大的功能建议先开 Issue 讨论，避免重复开发或方向不一致。

### 加入开发团队

如果你愿意长期参与维护，可以通过以下方式申请：

1. 在 GitHub 提交一个 Issue，标题写「申请加入开发团队」
2. 简单介绍：
   - 你的 GitHub 用户名
   - 你擅长的方向（前端 / 后端 / UI 设计 / 内容整理 / 测试等）
   - 每周大概能投入的时间
   - 你想参与的部分
3. 也可以直接加入页面中的 [QQ 群](https://qm.qq.com/q/guZg2hdNE4) 联系维护者

维护者会根据项目需要和你的意愿，邀请你加入仓库协作或开发团队。

### 可以贡献什么

- 前端页面、交互和响应式适配
- UI / 视觉 / 动效设计
- 流萤角色资料、活动资料、图集和视频整理
- 壁纸、同人内容、周边信息的收录与校对
- TypeScript / Node.js 后端与部署优化
- 文案、翻译、无障碍和移动端体验
- 测试、Issue 整理和新人答疑

### PR 注意事项

- 一次 PR 尽量只做一件事，保持改动清晰
- 不提交密钥、Token、服务器密码等敏感信息
- 新功能请同步更新 README 或相关文档
- 图片和游戏素材请确认来源与授权，尊重原作者和官方版权
- 提交前至少运行一次 `node server.ts`，确认首页和跳转正常

## 跳转配置

当前配置了以下 302 跳转：

| 源路径 | 目标 |
| --- | --- |
| `/image.Firefly` | `https://img.流萤.love/image.Firefly` |
| `/like.Firefly` | `https://img.流萤.love/like.Firefly` |
| `/look.html` | `https://img.流萤.love/look.html` |
| `/pixiv.Firefly` | `https://img.流萤.love/pixiv.Firefly` |
| `/thank.html` | `https://img.流萤.love/thank.html` |

新增一条 301 跳转：

```json
{
  "from": "/example",
  "to": "https://example.com/new-path",
  "status": 301
}
```

把规则加入 `redirects.json` 的 `rules` 数组即可。服务会自动重新加载配置，不需要重启。详细说明见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 版权与免责声明

- 本项目是非官方同人项目，与米哈游 / HoYoverse 及《崩坏：星穹铁道》官方无关。
- 游戏角色、官方图片、音乐、视频等素材版权归原权利人所有。
- 贡献素材前请确认来源与使用授权；如权利人提出要求，维护者会及时处理。
- 代码部分的开源许可证尚未最终确定，欢迎维护团队共同讨论后补充。

---

如果这个项目让你想起了那片星空，欢迎点一个 Star，或者直接加入我们一起把它做完。
