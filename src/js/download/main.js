document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    let loc = window.location
    let hash = loc.pathname.replace('/download/', '')
    window.location = 'https://steam.design/raw/' + hash
  }, 3000)
})
