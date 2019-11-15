const makeServiceWorkerEnv = require('service-worker-mock')

const HASH = '123HASHBROWN'

export const getEvent = (request: Request) => {
  const waitUntil = async (callback: any) => {
    await callback
  }
  return {
    request,
    waitUntil,
  }
}

export const mockKV = () => {
  const store: any = {
    'key1.123HASHBROWN.txt': 'val1',
    'key1.123HASHBROWN.png': 'val1',
    'index.123HASHBROWN.html': 'index.html',
    'cache.123HASHBROWN.html': 'cache me if you can',
    'nohash.txt': 'no hash but still got some result',
    'sub/blah.123HASHBROWN.png': 'picturedis',
  }
  return {
    get: (path: string) => store[path] || null,
  }
}

export const mockManifest = () => {
  return JSON.stringify({
    'key1.txt': `key1.${HASH}.txt`,
    'key1.png': `key1.${HASH}.png`,
    'cache.html': `cache.${HASH}.html`,
    'index.html': `index.${HASH}.html`,
    'sub/blah.png': `sub/blah.${HASH}.png`,
  })
}
let cacheStore: any = {}
export const mockCaches = () => {
  return {
    default: {
      match: (key: string) => {
        return cacheStore[key] || null
      },
      put: (key: string, val: Response) => {
        let headers = new Headers(val.headers)
        let resp = new Response(val.body, { headers })
        return (cacheStore[key] = resp)
      },
    },
  }
}

export function mockGlobal() {
  Object.assign(global, makeServiceWorkerEnv())
  Object.assign(global, { __STATIC_CONTENT_MANIFEST: mockManifest() })
  Object.assign(global, { __STATIC_CONTENT: mockKV() })
  Object.assign(global, { caches: mockCaches() })
}