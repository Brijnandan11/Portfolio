import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext({})

export function ContentProvider({ children }) {
  const [data, setData] = useState({})

  useEffect(() => {
    // Keep the site code-first. If an API exists, it should not override
    // the shipped defaults or bring back stale seeded content.
    window.__siteContent = {}
  }, [])

  return <Ctx.Provider value={data}>{children}</Ctx.Provider>
}

// fallback MUST be a module-level constant so identity stays stable
export function useContent(key, fallback) {
  const data = useContext(Ctx)
  const v = data[key]
  return useMemo(() => (v ? { ...fallback, ...v } : fallback), [v]) // eslint-disable-line
}

// "*word*" → orange serif accent
export const richWords = (text) =>
  String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) =>
      w.length > 2 && w.startsWith('*') && w.endsWith('*')
        ? [w.slice(1, -1), true]
        : [w.replace(/\*/g, ''), false]
    )

export const richParts = (text) =>
  String(text)
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((p) =>
      p.startsWith('*') && p.endsWith('*') ? { em: p.slice(1, -1) } : { t: p }
    )

export const lines = (text) => String(text).split('\n').filter(Boolean)
