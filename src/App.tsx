import type { RouteSectionProps } from '@solidjs/router'
import '@/assets/css/color.css'
import '@/assets/css/app.css'
import './App.css'

export default function App(props: RouteSectionProps) {
  return <div class="main__container">{props.children}</div>
}
