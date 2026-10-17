import { For, createMemo } from 'solid-js'
import { store } from '@/stores'

import ConverterPopup from '../converter/ConverterPopup'
import './ConvertersContainer.css'

export default function ConvertersContainer() {
  const converters = createMemo(() => store.converters?.filter((x) => x))

  // <For> keys rows by item reference (the store keeps the same proxy per converter),
  // which matches the Vue `:key="converter.id"`.
  return (
    <div class="container">
      <For each={converters()}>{(converter) => <ConverterPopup save={converter} />}</For>
    </div>
  )
}
