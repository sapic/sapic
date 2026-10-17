import { store, actions } from '@/stores'

/**
 * Browser tests hook. The end-to-end test scripts (and the browser extension that reads the
 * page state) were written against the Vue build and reach the store through
 * `#app.__vue_app__.config.globalProperties.$pinia`. This exposes the same shape, backed
 * by the Solid store, so the same tests run unchanged against both builds.
 *   $pinia.state.value.main  -> current state (read-only view)
 *   $pinia._s.get('main')    -> state + actions (e.g. .randomBackground(), .setPreviewScale(100))
 */
export function exposeTestHook(el: HTMLElement) {
  const acts: Record<string, unknown> = actions
  const main = new Proxy(store, {
    get: (target, key) =>
      typeof key === 'string' && Object.hasOwn(acts, key) ? acts[key] : Reflect.get(target, key),
  })
  const pinia = { state: { value: { main: store } }, _s: new Map([['main', main]]) }
  Object.defineProperty(el, '__vue_app__', {
    value: { config: { globalProperties: { $pinia: pinia } } },
    configurable: true,
  })
}
