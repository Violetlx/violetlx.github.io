---
title: api
date: 2020/05/29
---

This is api.
$$
\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^ Ir \cdots (r-i+1) (\log y)^{ri}} {\omega^i} \right\}
$$


:::: code-group 

::: code-group-item 指定首页

```vue
# another-home-path.md
---
title: 指定首页
home: true
---
```



::: 

::: code-group-item 指定首页路径

```vue
// .vuepress/config.ts

import { defineUserConfig } from 'vuepress'
import { recoTheme } from 'vuepress-theme-reco'

export default defineUserConfig({
  theme: recoTheme({
    home: '/another-home-path'
  })
})
```



::: 

::::