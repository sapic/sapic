import './Scripts.css'

const GA_ID = 'UA-98294219-4'

// The <script> elements must be created with document.createElement: Solid clones JSX from an
// innerHTML-parsed <template>, and scripts parsed that way are marked "already started" and never
// run. Vue's <component :is="'script'"> created them with createElement, so they executed; doing the
// same here gives the identical DOM (two scripts inside .scripts__container) and the same
// window.dataLayer / window.gtag globals.
function gtagLoader() {
  const el = document.createElement('script')
  el.async = true
  el.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  return el
}

function gtagInit() {
  const el = document.createElement('script')
  // Classic (non-module) inline script, so `function gtag` becomes window.gtag, as before.
  el.textContent =
    ' window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}' +
    ` gtag('js', new Date()); gtag('config', '${GA_ID}'); `
  return el
}

export default function Scripts() {
  return (
    <div class="scripts__container">
      {/* Global site tag (gtag.js) - Google Analytics */}
      {gtagLoader()}
      {gtagInit()}
    </div>
  )
}
