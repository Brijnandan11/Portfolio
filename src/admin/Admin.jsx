import { useCallback, useEffect, useState } from 'react'

const TOKEN_KEY = 'brij_admin_token'

const api = async (path, { method = 'GET', body } = {}) => {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ''}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText)
  return res.json()
}

const CONTENT_GROUPS = [
  {
    key: 'site',
    title: 'Site & socials',
    fields: [
      ['email', 'input', 'contact email'],
      ['github', 'input', 'github username (no url)'],
      ['linkedin', 'input', 'linkedin url'],
      ['x', 'input', 'x / twitter url'],
      ['note', 'input', 'note next to email button'],
    ],
  },
  {
    key: 'hero',
    title: 'Hero',
    fields: [
      ['intro', 'textarea', 'intro line — wrap a word in *stars* for orange italic'],
      ['roles', 'lines', 'rotating roles — one per line'],
      ['location', 'textarea', 'middle meta block (multi-line)'],
      ['folio', 'textarea', 'right meta block (multi-line)'],
    ],
  },
  {
    key: 'marquee',
    title: 'Marquee strip',
    fields: [['items', 'lines', 'phrases — one per line']],
  },
  {
    key: 'about',
    title: 'About',
    fields: [
      ['text', 'textarea', 'paragraph — *stars* = orange serif words'],
      ['stats', 'stats', 'one per line as: value | label  (use ∞ for infinity)'],
    ],
  },
  {
    key: 'services',
    title: 'Services',
    fields: [['list', 'namedesc', 'one per line as: Name | description']],
  },
  {
    key: 'terminal',
    title: 'Terminal skill bars',
    fields: [['bars', 'bars', 'one per line as: Label | percent']],
  },
]

const ser = (type, v) => {
  if (type === 'lines') return (v || []).join('\n')
  if (type === 'stats') return (v || []).map((s) => `${s.value} | ${s.label}`).join('\n')
  if (type === 'bars') return (v || []).map((b) => `${b.label} | ${b.pct}`).join('\n')
  if (type === 'namedesc') return (v || []).map((s) => `${s.name} | ${s.desc}`).join('\n')
  return v ?? ''
}

const parseField = (type, t) => {
  const rows = String(t).split('\n').map((s) => s.trim()).filter(Boolean)
  if (type === 'lines') return rows
  if (type === 'stats')
    return rows.map((r) => {
      const [value, ...rest] = r.split('|')
      return { value: value.trim(), label: rest.join('|').trim() }
    })
  if (type === 'bars')
    return rows.map((r) => {
      const [label, pct] = r.split('|')
      return { label: label.trim(), pct: +(pct || '0').trim() || 0 }
    })
  if (type === 'namedesc')
    return rows.map((r) => {
      const [name, ...rest] = r.split('|')
      return { name: name.trim(), desc: rest.join('|').trim() }
    })
  return t
}

const EMPTY_PROJECT = {
  key: '',
  title: '',
  url: '',
  description: '',
  tags: [],
  bg: 'linear-gradient(135deg, #33456b 0%, #131b2b 60%, #06080d 100%)',
  fg: '#e8e4dc',
  accent: '#ff4d00',
  mark: '',
  position: 0,
}

function Login({ onOk }) {
  const [token, setToken] = useState('')
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    localStorage.setItem(TOKEN_KEY, token)
    try {
      await api('/api/auth/check', { method: 'POST' })
      onOk()
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setErr('wrong token — check ADMIN_TOKEN in server/.env')
    }
  }
  return (
    <form className="a-login" onSubmit={submit}>
      <h1>BRIJ<span>®</span> admin</h1>
      <input
        type="password"
        placeholder="admin token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        autoFocus
      />
      {err && <p className="a-err">{err}</p>}
      <button type="submit">enter →</button>
    </form>
  )
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="a-form">
      <div className="a-grid">
        <label>key<input value={form.key} onChange={set('key')} placeholder="ferrox" /></label>
        <label>title<input value={form.title} onChange={set('title')} placeholder="Ferrox Gateway" /></label>
        <label>url<input value={form.url} onChange={set('url')} placeholder="ferrox.dev" /></label>
        <label>mark<input value={form.mark} onChange={set('mark')} placeholder="fx" /></label>
        <label>position<input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: +e.target.value })} /></label>
        <label>tags (comma separated)
          <input
            value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            placeholder="Rust, Actix, Redis"
          />
        </label>
      </div>
      <label>description<textarea rows={3} value={form.description} onChange={set('description')} /></label>
      <div className="a-grid">
        <label>bg (css gradient)<input value={form.bg} onChange={set('bg')} /></label>
        <label>fg<input value={form.fg} onChange={set('fg')} /></label>
        <label>accent<input value={form.accent} onChange={set('accent')} /></label>
      </div>
      <div className="a-preview" style={{ background: form.bg }}>
        <span style={{ color: form.fg }}>{form.title || 'preview'}</span>
        <i style={{ background: form.accent }} />
      </div>
      <div className="a-actions">
        <button className="a-primary" onClick={() => onSave(form)}>save</button>
        <button onClick={onCancel}>cancel</button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [editing, setEditing] = useState(null) // null | 'new' | project object
  const [newSkill, setNewSkill] = useState({ name: '', variant: '' })
  const [status, setStatus] = useState('')
  const [draft, setDraft] = useState({})

  const flash = (msg) => {
    setStatus(msg)
    setTimeout(() => setStatus(''), 2500)
  }

  const load = useCallback(async () => {
    const [p, s, c] = await Promise.all([
      api('/api/projects'),
      api('/api/skills'),
      api('/api/content'),
    ])
    setProjects(p)
    setSkills(s)
    const d = {}
    CONTENT_GROUPS.forEach((g) => {
      d[g.key] = {}
      g.fields.forEach(([f, type]) => {
        d[g.key][f] = ser(type, c?.[g.key]?.[f])
      })
    })
    setDraft(d)
  }, [])

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    api('/api/auth/check', { method: 'POST' })
      .then(() => setAuthed(true))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
  }, [])

  useEffect(() => {
    if (authed) load().catch((e) => flash(`load failed: ${e.message}`))
  }, [authed, load])

  if (!authed) return <Login onOk={() => setAuthed(true)} />

  const saveProject = async (form) => {
    try {
      if (form.id) await api(`/api/projects/${form.id}`, { method: 'PUT', body: form })
      else await api('/api/projects', { method: 'POST', body: form })
      setEditing(null)
      await load()
      flash('saved ✓')
    } catch (e) {
      flash(`error: ${e.message}`)
    }
  }

  const deleteProject = async (p) => {
    if (!confirm(`delete "${p.title}"?`)) return
    await api(`/api/projects/${p.id}`, { method: 'DELETE' })
    await load()
    flash('deleted')
  }

  const addSkill = async () => {
    if (!newSkill.name.trim()) return
    await api('/api/skills', {
      method: 'POST',
      body: { ...newSkill, position: skills.length },
    })
    setNewSkill({ name: '', variant: '' })
    await load()
    flash('skill added ✓')
  }

  const cycleVariant = async (s) => {
    const next = s.variant === '' ? 'v-ink' : s.variant === 'v-ink' ? 'v-accent' : ''
    await api(`/api/skills/${s.id}`, { method: 'PUT', body: { ...s, variant: next } })
    await load()
  }

  const deleteSkill = async (s) => {
    await api(`/api/skills/${s.id}`, { method: 'DELETE' })
    await load()
  }

  const setField = (gKey, f, val) =>
    setDraft((d) => ({ ...d, [gKey]: { ...d[gKey], [f]: val } }))

  const saveGroup = async (g) => {
    try {
      const value = {}
      g.fields.forEach(([f, type]) => {
        value[f] = parseField(type, draft[g.key]?.[f] ?? '')
      })
      await api(`/api/settings/${g.key}`, { method: 'PUT', body: value })
      flash(`${g.title} saved ✓ — refresh the site to see it`)
    } catch (e) {
      flash(`error: ${e.message}`)
    }
  }

  return (
    <div className="a-shell">
      <header className="a-head">
        <h1>BRIJ<span>®</span> admin</h1>
        <nav>
          <button className={tab === 'projects' ? 'is-active' : ''} onClick={() => setTab('projects')}>
            projects ({projects.length})
          </button>
          <button className={tab === 'skills' ? 'is-active' : ''} onClick={() => setTab('skills')}>
            skills ({skills.length})
          </button>
          <button className={tab === 'content' ? 'is-active' : ''} onClick={() => setTab('content')}>
            content
          </button>
        </nav>
        <div className="a-head-right">
          {status && <span className="a-status">{status}</span>}
          <a href="/" target="_blank" rel="noreferrer">view site ↗</a>
          <button
            onClick={() => {
              localStorage.removeItem(TOKEN_KEY)
              setAuthed(false)
            }}
          >
            logout
          </button>
        </div>
      </header>

      {tab === 'projects' && (
        <main className="a-main">
          {editing === 'new' && (
            <ProjectForm initial={EMPTY_PROJECT} onSave={saveProject} onCancel={() => setEditing(null)} />
          )}
          {editing === null && (
            <button className="a-add" onClick={() => setEditing('new')}>+ new project</button>
          )}
          {projects.map((p) =>
            editing && editing.id === p.id ? (
              <ProjectForm key={p.id} initial={editing} onSave={saveProject} onCancel={() => setEditing(null)} />
            ) : (
              <div className="a-row" key={p.id}>
                <span className="a-swatch" style={{ background: p.bg }} />
                <div className="a-row-main">
                  <b>{p.title}</b>
                  <small>{p.url} · {p.tags.join(', ')}</small>
                </div>
                <span className="a-pos">#{p.position}</span>
                <button onClick={() => setEditing(p)}>edit</button>
                <button className="a-danger" onClick={() => deleteProject(p)}>delete</button>
              </div>
            )
          )}
        </main>
      )}

      {tab === 'content' && (
        <main className="a-main">
          <p className="a-hint">
            everything below is live site copy — edit, save the group, refresh the site.
          </p>
          {CONTENT_GROUPS.map((g) => (
            <div className="a-form a-group" key={g.key}>
              <h3 className="a-group-title">{g.title}</h3>
              {g.fields.map(([f, type, hint]) => (
                <label key={f}>
                  {f} — {hint}
                  {type === 'input' ? (
                    <input
                      value={draft[g.key]?.[f] ?? ''}
                      onChange={(e) => setField(g.key, f, e.target.value)}
                    />
                  ) : (
                    <textarea
                      rows={type === 'textarea' ? 3 : 4}
                      value={draft[g.key]?.[f] ?? ''}
                      onChange={(e) => setField(g.key, f, e.target.value)}
                    />
                  )}
                </label>
              ))}
              <div className="a-actions">
                <button className="a-primary" onClick={() => saveGroup(g)}>
                  save {g.key}
                </button>
              </div>
            </div>
          ))}
        </main>
      )}

      {tab === 'skills' && (
        <main className="a-main">
          <div className="a-skill-add">
            <input
              placeholder="new skill (e.g. Svelte)"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <button className="a-primary" onClick={addSkill}>add</button>
          </div>
          <p className="a-hint">click a chip to cycle its style (outline → cream → orange) · ✕ to remove</p>
          <div className="a-chips">
            {skills.map((s) => (
              <span key={s.id} className={`a-chip ${s.variant}`}>
                <button className="a-chip-name" onClick={() => cycleVariant(s)}>{s.name}</button>
                <button className="a-chip-x" onClick={() => deleteSkill(s)}>✕</button>
              </span>
            ))}
          </div>
        </main>
      )}
    </div>
  )
}
