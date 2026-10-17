import { For, Show } from 'solid-js'
import { store, actions } from '@/stores'
import { t } from '@/i18n'
import CloudDownload from './CloudDownload'
import './MenuWindow.css'

// Desktop and mobile zoom steps. Mobile keeps the same ids (scale50..scale100) as desktop.
const DESKTOP_SCALES: [string, number][] = [
  ['scale50', 50],
  ['scale75', 75],
  ['scale100', 100],
  ['scale125', 125],
]
const MOBILE_SCALES: [string, number][] = [
  ['scale50', 15],
  ['scale75', 20],
  ['scale100', 25],
]

const SITE_URL = import.meta.env.PROD ? 'https://steam.design' : 'http://localhost:3000'

const loginUrl = (() => {
  const returnUrl = encodeURIComponent(SITE_URL)
  const realm = encodeURIComponent(SITE_URL)
  return `https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=${returnUrl}&openid.realm=${realm}&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select`
})()

function getExtensionLink(): string | null {
  if (navigator.userAgent.indexOf('Chrome') !== -1) {
    return 'https://chrome.google.com/webstore/detail/steam-profile-assistant/mjmabgdoainclinjecbkdancpamdiaih'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    return 'https://addons.mozilla.org/en-US/firefox/addon/steam-design-buttons/'
  }

  return null
}

export default function MenuWindow() {
  const isMobile = window.screen.width < 560
  const extensionLink = getExtensionLink()

  const setPreviewScale = (value: number) => {
    actions.setPreviewScale(value)
    actions.trackClick(['setPreviewScale', value])
  }

  // Load the background from the URL box once the URL is complete
  const applyUrl = (input: HTMLInputElement) => {
    const value = input.value.trim()
    if (/^https?:\/\/\S+$/i.test(value)) {
      actions.setBackgroundURL(value)
    }
  }

  // A paste is a whole URL: apply it right away (after the input has the new value)
  const onUrlPaste = (e: ClipboardEvent) => {
    const input = e.currentTarget
    if (input instanceof HTMLInputElement) setTimeout(() => applyUrl(input), 0)
  }

  const randomBGClick = () => {
    actions.randomBackground()
    actions.trackClick(['randomBGButton'])
  }

  const getZipClick = (e: MouseEvent) => {
    actions.downloadZip({ ctrl: e.ctrlKey, alt: e.altKey })
    actions.trackClick(['getZIPButton'])
  }

  const getCurrentBGClick = () => {
    actions.getCurrentBg()
    actions.trackClick(['getBGButton'])
  }

  return (
    <div class="menu__window">
      <div class="menu__window-buttons">
        <div class="menu__window-button menu__window-button-download" onClick={getZipClick}>
          <CloudDownload class="menu__window-icon" />
          <div class="menu__window-button-text">{t('index.download')}</div>
        </div>
        <Show when={!isMobile}>
          <a
            class="menu__window-button purple-paradise"
            href="https://backgrounds.gallery/?utm_source=steam.design"
            target="_blank"
          >
            <div class="menu__window-button-text">{t('index.backgrounds')}</div>
          </a>
        </Show>

        <div class="menu__window-button" onClick={randomBGClick}>
          <div class="menu__window-button-text">{t('index.random')}</div>
        </div>
        <div class="menu__window-button" onClick={getCurrentBGClick}>
          <div class="menu__window-button-text">{t('index.getThisBg')}</div>
        </div>

        {/* Applied on change (paste lands as a single input, Enter, or leaving the box),
            not on every keystroke: each partial URL used to be fetched */}
        <input
          id="urltextbox"
          value=""
          class="menu__window-button textbox noclick"
          onChange={(e) => applyUrl(e.currentTarget)}
          onPaste={onUrlPaste}
          placeholder={t('index.pasteUrlPlaceholder')}
        />

        <div class="menu__window-section-container">
          <div class="menu__window-title">
            <div class="menu__window-button-text">{t('index.zoomScale')}:</div>
          </div>
          <div class="menu__window-scale__container">
            <For each={isMobile ? MOBILE_SCALES : DESKTOP_SCALES}>
              {([id, value]) => (
                <>
                  <input
                    id={id}
                    class="menu__window-scale__input"
                    name="scale"
                    type="radio"
                    checked={store.previewScale === value}
                    onChange={() => setPreviewScale(value)}
                  />
                  <label class="menu__window-scale__label" for={id}>
                    <div class="menu__window-scale__button">{value}%</div>
                  </label>
                </>
              )}
            </For>
          </div>
        </div>
        <Show
          when={!store.user.id}
          fallback={
            <div class="menu__window-button" onClick={() => actions.logout()}>
              <div class="menu__window-button-text">{t('index.logout')}</div>
            </div>
          }
        >
          <a class="menu__window-button steam" href={loginUrl}>
            <div class="menu__window-button-text">{t('index.login')}</div>
          </a>
        </Show>
      </div>
      <div class="menu__window-credits">
        <div class="menu__window-title">
          <div class="menu__window-button-text">{t('index.our')}:</div>
        </div>
        <a
          class="menu__window-button"
          href="https://patreon.com/steamdesign"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div class="menu__window-button-text">Patreon</div>
        </a>
        <div class="menu__window-multi-container">
          <a class="menu__window-multi-label" href="https://github.com/sapic/sapic" target="_blank">
            <div class="menu__window-multi-button">GitHub</div>
          </a>
          <a
            class="menu__window-multi-label"
            href="https://steamcommunity.com/groups/sapic"
            target="_blank"
          >
            <div class="menu__window-multi-button">{t('index.ourGroup')}</div>
          </a>
          <a
            class="menu__window-multi-label"
            href="https://old.steam.design/?utm_source=steam.design"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="menu__window-multi-button">{t('index.ourOldSite')}</div>
          </a>
          <Show when={extensionLink}>
            {(link) => (
              <a class="menu__window-multi-label" href={link()} target="_blank">
                <div class="menu__window-multi-button">{t('index.ourExtension')}</div>
              </a>
            )}
          </Show>
        </div>
        <a
          class="menu__window-discord"
          href="https://discord.com/invite/jnqnHuX"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="menu__window-discord-image"
            src="https://discordapp.com/api/guilds/304986224467378177/widget.png?style=banner2"
          />
        </a>
        <div class="menu__window-credits-text">Made with ❤️ by TrueCarry and The Oddball</div>
      </div>
    </div>
  )
}
