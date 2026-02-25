# mashiro-theme

Personal fork of [hexo-theme-mashiro](https://github.com/bill-xia/hexo-theme-mashiro) by [bill-xia](https://github.com/bill-xia), a CTeX-style academic Hexo theme.

Used on [mazzzystar.com](https://mazzzystar.com).

## Changes from upstream

- **Font subsetting**: Replaced `font-spider` with a custom 3-tier subsetting system (`source/fonts/subsets/`), splitting Chinese fonts by character frequency for progressive loading (~160KB tier1, ~200KB tier2, ~210KB tier3)
- **Font loader**: Added `source/js/font-loader.js` for async font loading
- **Template updates**: Modified `layout.ejs`, `head.ejs`, `post/title.ejs` for font integration
- **Language**: Consolidated `zh-CN.yml`/`zh-TW.yml` into `zh.yml`
- **Style tweaks**: Adjusted `_variables.styl`, `style.styl`, `style.css`

## Original

See [bill-xia/hexo-theme-mashiro](https://github.com/bill-xia/hexo-theme-mashiro) for the original theme, documentation, and configuration guide.
