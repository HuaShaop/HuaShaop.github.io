---
title: "把博客从 Jekyll 搬到 Astro：一次彻底的重建"
description: "GitHub Pages 上的教程站，怎么用 Astro Paper 重构成一个能长期写下去的个人博客，以及踩到的三个坑。"
pubDatetime: 2026-10-25T15:00:00+08:00
modDatetime: 2026-10-25T18:00:00+08:00
tags: ["Astro", "GitHub Pages", "建站"]
draft: false
featured: true
---

## 起因

这个站最早的形态，是跟着 GitHub Skills 教程跑出来的：Jekyll + Minima，四行 `_config.yml`，一篇文章，能访问，但也仅此而已。

Minima 的问题不是不好看，而是**没法长**：

- 主题只能靠 SCSS 变量微调，想改布局就得覆盖模板；
- GitHub Pages 的分支构建跑在 safe mode 里，`jekyll-archives`、`jekyll-paginate-v2` 这类插件不在白名单；
- 每次 push 触发一次完整构建，还有每小时 10 次的软限制。

我想要的是一个能放文章、项目和实验的个人主页，不是一篇永远停在那儿的「Hello World」。

## 为什么是 Astro

比较了三条路：

| 方案              | 优点                     | 放弃的原因                     |
| ----------------- | ------------------------ | ------------------------------ |
| Jekyll + Chirpy   | 迁移成本最低，功能齐全   | 仍是 Ruby 插件生态，定制受限制 |
| Hugo + PaperMod   | 构建最快，单二进制       | 想加交互组件要写 Go template   |
| **Astro + 主题**  | 组件化、默认零 JS、能嵌交互 | 需要 Node 工具链              |

决定性理由是 **islands**：以后想把物理沙盒直接嵌进文章里，写一个 `client:visible` 的组件就行，不用 iframe，也不用在一堆 HTML 里塞 `<script>`。

## 迁移过程

旧内容只有一篇测试文，没必要做数据迁移，直接重建。真正要保住的是「仓库」和「网址」——`<username>.github.io` 这个仓库名就是域名，删了要重建，得不偿失。

```bash
git clone https://github.com/HuaShaop/HuaShaop.github.io
git tag v1-jekyll              # 存档点，随时能回去
git switch -c rebuild/astro
git rm -r _config.yml index.md _posts .github
```

接着把主题文件拷进来、删掉示例文章、改站点信息、加一个部署 workflow，最后把 Pages 的 Source 从「Deploy from a branch」改成「GitHub Actions」。

现在这篇文章的每一个字，都是在 `src/content/posts/` 下写完、push 之后由 Actions 构建出来的。

## 踩到的三个坑

### 1. Google Fonts 拉不下来

`npm run dev` 卡在字幕一样的重试里：

```text
Could not fetch from `https://fonts.google.com/metadata/fonts`. Will retry in `1000ms`. `3` retries left.
```

Astro 7 的字体 API 在启动和构建时都会去拉字体元数据，国内直连不通。处理方式是删掉 `fonts` 配置，把 `--font-app` 换成系统字体栈——中文站反而更合适，那套字体本来就没有中文字形。

### 2. Windows 上没有 `cp`

模板的构建脚本是：

```bash
astro build && pagefind --site dist && cp -r dist/pagefind public/
```

`cp` 在 Windows 的 `cmd` 里不存在，`npm run build` 直接失败。把最后一段去掉即可：CI 跑在 Linux 上不需要它，本地也用不上。

### 3. i18n 的 `MissingLocale`

把 `site.lang` 改成 `zh-CN` 之后，RSS 阶段报错：

```text
MissingLocale: The locale/path `zh-CN` does not exist in the configured `i18n.locales`.
```

原因是 `astro.config.ts` 里只声明了 `["en"]`，而 `getRelativeLocaleUrl("zh-CN", ...)` 要求目标语言在列表里。补上 `locales: ["zh-CN", "en"]` 和 `defaultLocale: "zh-CN"` 就好了。

## 现在的状态

- 中文界面、深浅色、RSS / sitemap / robots 齐全
- 文章、标签、归档、搜索（Pagefind）可用
- 项目页和实验室还在路上

下一步是评论、项目详情页，以及把物理沙盒接进来。如果你也在犹豫要不要换掉教程站，我的建议是：**先想清楚这个站要放什么，再选工具**。工具只决定改造要花多久，内容才决定它值不值得存在。
