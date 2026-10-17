# steam.design: Vue 3 -> SolidJS rewrite. Shared rules for every agent

Repo: `/home/daytona/sapic-solid` (git worktree, branch `feat/solid`). The site is steam.design:
pick a Steam profile background, preview it on a fake profile, download crops (ZIP).
**The result must look and behave exactly like the Vue version.** This is a 1:1 port, not a redesign.

Reference (do not edit): the Vue originals are still in the tree as `*.vue` files next to where
your `.tsx` goes. A fully working Vue build of master is served at **http://127.0.0.1:4170/**,
so open it to see the real behaviour.

## Already done (do not rewrite, only use)
- `src/stores/index.ts`: Solid store, same state and action names as the old Pinia store.
  ```ts
  import { store, actions, isVideo, setStore } from '@/stores'
  store.background            // reactive reads: use them inside JSX or createMemo/createEffect
  actions.randomBackground()  // every former Pinia action: setBackground, setBackgroundURL,
                              // setPreviewScale, setUser, setBgSize, setInventoryBackgrounds, logout,
                              // addConvertItem, removeConvertItem, downloadZip, getCurrentBg,
                              // loadBackpack, trackClick, findBackground
  ```
  `mapState(useMainStore, ['x'])` / `store.x` in Vue becomes plain `store.x` read inside JSX.
- `src/stores/init.ts`: start-up (localStorage, hash, catalogue fetch). Already wired.
- `src/i18n.ts`: `import { t } from '@/i18n'`; `$t('index.download')` becomes `t('index.download')`.
- `src/main.tsx`: router with the same routes. Pages are default exports:
  `src/components/pages/index/IndexPage.tsx` and `src/components/pages/converter/Converter.tsx`.
  Route params: `import { useParams } from '@solidjs/router'`, then `useParams().raw`.
- `vite.config.ts` uses `vite-plugin-solid`; `tsconfig.json` has `jsxImportSource: solid-js`.

## How to port a component
- One `.vue` becomes one `.tsx` with the **same file name** (PascalCase if the Vue file was lowercase,
  e.g. `tradeit.vue` -> `Tradeit.tsx`, `convertRow.vue` -> `ConvertRow.tsx`, `index.vue` -> `Converter.tsx`).
  Default export the component. **Delete the `.vue` file** when your `.tsx` replaces it.
- Template -> JSX: `class` stays `class`; `v-if` -> `<Show>`; `v-for` -> `<For>`; `:style="{...}"` -> `style={{...}}`
  with **CSS property names in kebab-case** (`'background-image'`, not `backgroundImage`) and units
  as strings; `@click` -> `onClick`; `ref="x"` -> `let x!: HTMLDivElement; <div ref={x}>`.
- `ref()` -> `createSignal`; `computed()` -> `createMemo` (or a plain function); `watch` -> `createEffect(on(...))`;
  `onMounted` -> `onMount`; `onBeforeUnmount` -> `onCleanup`; `nextTick` -> `queueMicrotask` or run after the DOM update in an effect.
- Props: **never destructure props** (breaks reactivity). Use `props.x`. Emits become callback props:
  `emit('converted', x)` -> `props.onConverted(x)`.
- Keep every existing comment that explains *why*. Keep behaviour identical, including the
  bug fixes already on master (they are documented in comments: zoom centring, URL box
  applying on paste/Enter/blur only, `isLoadableUrl`, the 4K video downscale in BgPreloader, etc.).

## Styles: CSS Modules, no stylus
Vue `<style scoped lang="stylus">` becomes a sibling **`Name.module.css`** in plain CSS:
```tsx
import s from './MenuWindow.module.css'
<div class={s['menu__window']}>
```
- Convert stylus by hand: nesting `&-foo` -> full class name `.menu__window-foo`; indentation -> braces;
  `$color-main` -> `var(--color-main)` (all of color.styl is mirrored as CSS variables in
  `src/assets/css/color.css`, which App.tsx imports). Stylus functions like `transparentify($color-main, 0.7)`
  become literal values (e.g. `rgba(18, 21, 26, 0.7)`). Compare in the browser against :4170.
- Keep every class name exactly the same (the tests select by class: `.preview__window`,
  `.zoom_out`, `.profile__preview`, `.profile__preview-bg`, `.menu__window-button`,
  `.menu__window-button-download`, `#urltextbox`, `label[for="scale100"]`, `.converter__container`,
  `.inventory-item`, `.friend`, `.right__menu`, `.download__button`, `.item`, `svg[width="976"]`...).
  With CSS Modules the real class becomes hashed, **so the tests would break**. To keep the
  real names, every module class must also be emitted as its plain name. This is already configured in
  `vite.config.ts` (`css.modules.generateScopedName: '[local]'`), which means class names stay as written and
  scoping is by convention (the old BEM-ish names are already unique). So in practice:
  **write `class="menu__window"` as a plain string and put the CSS in `Name.module.css` imported for its side effect**
  (`import './MenuWindow.module.css'`). Do not use `s[...]`.
- Non-scoped `<style>` blocks (global rules: `html, body`, scrollbars, `#app`) go into
  `src/assets/css/app.css`, which `App.tsx` imports. Only the App/IndexPage agent edits that file;
  everyone else reports global CSS they need in their final message.

## Ownership: touch only your files
Each agent owns a list of files below. Do not edit anyone else's files. If you need something
from another part (a prop, a shared helper), write down exactly what you need in your final message.
Component interfaces (props) between agents are fixed in "Contracts" below. Implement them exactly.

## Contracts (props between parts)
- `IndexPage.tsx` renders, in this order (same DOM as IndexPage.vue): `<MenuWindow/>`, the preview
  frame with `<ConvertersContainer/>` and `.preview__window > .zoom_out > <ImagePreview/> <BgPreloader/>`,
  then `<RightMenu/>` + `<InventoryContainer/>` (desktop) or `<MobileHeader/>` (mobile), then `<Scripts/>`.
  All of these take **no props**; they read the store.
- `ImagePreview.tsx` renders `<Overlay imageHeight={number} />` (`Overlay` prop: `imageHeight?: number`, default 1200).
- `RightMenu.tsx` renders `<Ads />` (no props). `Ads.tsx` renders `<DuoBot />` (no props).
- `MenuWindow.tsx` renders `<CloudDownload class="menu__window-icon" />` (`CloudDownload` prop: `class?: string`).
- `ConvertersContainer.tsx` renders `<For each={converters}>{(c) => <ConverterPopup save={c} />}</For>`
  (`ConverterPopup` prop: `save: ConverterProp`).
- `ConverterPopup.tsx` and `Converter.tsx` render `<ConvertRow info={ImageInfo} url={string}
  onConverted={(info: ImageInfo & {data}) => void} onCanceled={(info) => void} />` where needed.
- `src/components/pages/converter/convert.ts` and `src/utils/*.ts` are plain TS and stay as they are
  (only the converter agent may adjust convert.ts if needed).

## Done means
1. `cd /home/daytona/sapic-solid && export PATH=/tmp/cpbin:/usr/local/share/nvm/versions/node/v25.6.0/bin:$PATH COREPACK_ENABLE_DOWNLOAD_PROMPT=0`
2. `npx tsc --noEmit -p . 2>&1 | grep <your files>` shows **no errors in your files**
   (errors in files other agents have not finished yet are expected; ignore them).
3. `npx oxlint <your files>`: 0 errors.
4. `npx oxfmt <your files>` (format them).
5. Your `.vue` files are deleted; no file outside your list is changed.
6. **Do not commit.** The coordinator commits once all parts are in.
7. Final message: files created/deleted, anything you could not port 1:1, global CSS you need
   added, anything you need from another agent.
