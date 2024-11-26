import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
// @ts-ignore
import navbarData from "./navbar/index.json";
// @ts-ignore
import sidebarData from "./sidebar/index.json";

const zhNavbar = navbarData;
const zhSidebar = sidebarData;

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
    docsDir: "example",
    lastUpdatedText: "",
    // series 为原 sidebar
    series: zhSidebar,
    navbar: zhNavbar,
    bulletin: {
      body: [
        {
          type: "text",
          content: `欢迎来到 VioletDocs 文档仓库！！！`,
          style: "font-size: 12px;",
        },
      ],
    },
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
