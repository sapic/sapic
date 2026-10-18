import logo from '@/assets/images/logo.svg'
// Not scoped in the Vue version (plain <style lang="stylus">): imported for its side effect.
import './MobileHeader.css'

export default function MobileHeader() {
  return (
    <div class="mobile__header">
      <div class="mobile__header-container">
        <img class="mobile__header-image" src={logo} />
        <h1 class="mobile__header-name">Steam.Design</h1>
      </div>
    </div>
  )
}
