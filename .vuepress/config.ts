import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
// @ts-ignore
import navbarData from "./navbar/index.json";
// @ts-ignore
import sidebarData from "./sidebar/index.json";
import { gitPlugin } from '@vuepress/plugin-git';

const zhNavbar = navbarData;
const zhSidebar = sidebarData;

// @ts-ignore
export default defineUserConfig({
  title: "VioletDocs",
  description: "Just playing around",
  bundler: viteBundler(),
  // bundler: webpackBundler(),
  theme: recoTheme({
    // @ts-ignore
    style: "@vuepress-reco/style-default",
    logo: "/favicon.ico",
    author: "violet",
    authorAvatar: "/avatar.png",
    docsRepo: "https://github.com/Violetlx/violetlx.github.io/tree/gh-pages",
    docsBranch: "gh-pages",
    docsDir: "/docs",
    lastUpdatedText: "",
    // series 为原 sidebar
    series: zhSidebar,
    navbar: zhNavbar,
    markdown: {
      lineNumbers: true // 代码块显示行号
    },
    bulletin: {
      body: [
        {
          type: "text",
          content: `欢迎来到 VioletDocs 文档仓库！！！`,
          style: "font-size: 12px;",
        },
      ],
    },
    commentConfig: {
      type: 'giscus',
      // options 与 1.x 的 valineConfig 配置一致
      options: {
        repo: 'violetlx/violetlx.github.io',
        repoId: 'R_kgDONUy8uw',
        category: 'General',
        categoryId: 'DIC_kwDONUy8u84CknFq',
        mapping: 'pathname',

        //hideComments: true // 隐藏评论
      },
    },
  }),
  plugins: [
    gitPlugin({
      // 配置项
      // @ts-ignore
      ignore: [
          '**/~*.md'
      ]
    }),
  ]
  // debug: true,
});
