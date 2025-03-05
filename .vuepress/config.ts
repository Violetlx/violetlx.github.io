import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
// @ts-ignore
import navbarData from "./navbar/index.json";
// @ts-ignore
import sidebarData from "./sidebar/index.json";
// @ts-ignore
import friendshipLinksData from "./friendshipLinks/index.json";
import { gitPlugin } from '@vuepress/plugin-git';
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'
import { markdownStylizePlugin } from '@vuepress/plugin-markdown-stylize'
import { markdownExtPlugin } from '@vuepress/plugin-markdown-ext'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'


const zhNavbar = navbarData;
const zhSidebar = sidebarData;
const zhFriendshipLinks = friendshipLinksData;

// @ts-ignore
export default defineUserConfig({
  title: "VioletDocs",
  description: "Just playing around",
  bundler: viteBundler(),
  port: 8089,
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
    // series 为原 sidebar
    series: zhSidebar,
    navbar: zhNavbar,
    friendshipLinks: zhFriendshipLinks,
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
    tip: '提示',
    info: '信息',
    danger: '危险',
    warning: '警告',
    details: '详情',
    tagsText: '标签',
    backToHome: '返回首页',
    categoriesText: '分类',
    catalogTitle: '页面导航',
    editLinkText: '编辑当前页面',
    lastUpdatedText: '最后更新时间',
    selectLanguageName: '简体中文',
    notFound: '哇哦，没有发现这个页面！',
    inputPasswordText: '请输入密码',
    unlockSucessText: '密码正确，玩得开心！',
    unlockFailuerText: '密码错误，请重新输入！'
  }),
  head: [
    ["script", {
      "language": "javascript",
      "type": "text/javascript",
      "src": "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"
    }],
  ],
  plugins: [
    gitPlugin({
      // 配置项
      // @ts-ignore
      ignore: [
          '**/~*.md'
      ]
    }),
    // 数学公式
    markdownMathPlugin({
      // 配置项
      type: 'katex',
      copy: true,
      mhchem: true,
    }),
    markdownStylizePlugin({
      align: true,
      attrs: true,
      mark: true,
      spoiler: true,
      sup: true,
      sub: true,
    }),
    markdownExtPlugin({
      // 选项
      gfm: true,
      footnote: true,
      tasklist: true,
      breaks: true,
      linkify: true,
      component: true,
      vPre: true,
    }),
    mediumZoomPlugin({
      selector: 'img',
    }),
  ]
  // debug: true,
});
