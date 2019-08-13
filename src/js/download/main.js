document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        let loc = window.location
        let hash = loc.pathname.replace('/download/', '')
        let rawUrl = 'https://steam.design/raw/' + hash
        window.location = rawUrl;
        let clickableLink = document.getElementById('clickableLink');
        clickableLink.href = rawUrl;
    }, 3000)
})