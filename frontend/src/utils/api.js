const BASE = ''

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : {}
}

export const apiGet = (url) => fetch(BASE + url, { credentials: 'include' }).then(handle)
export const apiPost = (url, body) => fetch(BASE + url, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handle)
export const apiPut = (url, body) => fetch(BASE + url, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(handle)
export const apiDelete = (url) => fetch(BASE + url, { method: 'DELETE', credentials: 'include' }).then(handle)
