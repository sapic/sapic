import { render } from 'solid-js/web'
import { Router, Route, useParams, type RouteSectionProps } from '@solidjs/router'
import { createEffect, lazy } from 'solid-js'
import initStore from './stores/init'
import { setLocale } from './i18n'
import App from './App'

// Same routes as the Vue router on master:
//   /  /converter  /converter/:raw  and the same three under /:lang
const IndexPage = lazy(() => import('./components/pages/index/IndexPage'))
const Converter = lazy(() => import('./components/pages/converter/Converter'))

/** /:lang/... sets the UI language when it is one we have (en, ru, zh-CN, zh-HK, zh-TW, tr) */
function LangLayout(props: RouteSectionProps) {
  const params = useParams()
  createEffect(() => setLocale(params.lang ?? ''))
  return <>{props.children}</>
}

// Start-up runs alongside the first render; errors only mean no catalogue update
initStore().catch((e) => console.log('init error', e))

render(
  () => (
    <Router root={App}>
      <Route path="/" component={IndexPage} />
      <Route path="/converter" component={Converter} />
      <Route path="/converter/:raw" component={Converter} />
      <Route path="/:lang" component={LangLayout}>
        <Route path="/" component={IndexPage} />
        <Route path="/converter" component={Converter} />
        <Route path="/converter/:raw" component={Converter} />
        <Route path="*" component={IndexPage} />
      </Route>
    </Router>
  ),
  document.getElementById('app')!
)
