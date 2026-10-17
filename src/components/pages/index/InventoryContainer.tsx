import { For, Show, createMemo, createSignal } from 'solid-js'
import { actions, store } from '@/stores'
import type { InventoryItem } from '@/stores'
import { Background } from '@/types/store'
import { t } from '@/i18n'
import './InventoryContainer.css'

export default function InventoryContainer() {
  const width = window.innerWidth - 250 - 300 - 200 - 9
  const itemsIncr = Math.floor(width / 108)
  const startRows = 3
  const [pagination, setPagination] = createSignal(1)

  const [shouldShowRandomBgs, setShouldShowRandomBgs] = createSignal(false)

  const start = createMemo(() => {
    if (store.backgrounds.length === 0) {
      return 0
    }
    const first = Math.floor(Math.random() * store.backgrounds.length) - itemsIncr * startRows
    return Math.max(first, 0)
  })

  const randomBgs = createMemo(() => {
    if (store.backgrounds.length === 0) {
      return []
    }

    let end = start() + itemsIncr * startRows * pagination()
    if (end > store.backgrounds.length - 1) {
      end = store.backgrounds.length
    }

    return store.backgrounds.slice(start(), end)
  })

  function setBackground(item: InventoryItem) {
    const link = item.actions![0].link
    actions.setBackground({
      background: link,
      info: item,
    })
    window.location.hash = '#' + link
  }

  function setBackgroundItem(item: Background) {
    actions.setBackground({
      background: getUrl(item.steamUrl),
      info: item,
    })

    window.location.hash = '#' + getUrl(item.steamUrl)
  }

  function getUrl(url: string) {
    if (url.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
      return url.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
    } else {
      return url
    }
  }

  function addRandomBgs() {
    setPagination((p) => p + 1)
    actions.trackClick(['loadMoreRandomBGs'])
  }

  setTimeout(() => {
    setShouldShowRandomBgs(true)
  }, 256)

  return (
    <div class="backgrounds_container">
      <Show when={store.user.id}>
        <p class="hover-button">{t('inventory.inventory')}</p>
        <div class="inventory-list">
          <For each={store.inventory}>
            {(item) => (
              <div class="inventory-item" onClick={() => setBackground(item)}>
                <img
                  class="inventory-item-inner"
                  src={`https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url_large}/62fx62f`}
                />
              </div>
            )}
          </For>
        </div>
      </Show>
      <p class="hover-button">{t('inventory.random')}</p>
      <Show when={shouldShowRandomBgs()}>
        <div class="inventory-list">
          <For each={randomBgs()}>
            {(item) => (
              <div class="inventory-item" onClick={() => setBackgroundItem(item)}>
                <img
                  class="inventory-item-inner"
                  src={`https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/62fx62f`}
                />
              </div>
            )}
          </For>
        </div>
      </Show>
      <p class="inventory-more purple-paradise" onClick={addRandomBgs}>
        {t('inventory.loadMore')}
      </p>
      <div class="spacer"></div>
    </div>
  )
}
