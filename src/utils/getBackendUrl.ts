export function getBackendUrl() {
  return import.meta.env.VITE_BACKEND_URL ?? 'https://steam.design/raw/'
}
