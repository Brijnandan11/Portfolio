const skill = (data) => data

const DOCS = {
  TypeScript: 'https://www.typescriptlang.org/docs/',
  React: 'https://react.dev/',
  'Node.js': 'https://nodejs.org/en/docs',
  Express: 'https://expressjs.com/',
  'PostgreSQL': 'https://www.postgresql.org/docs/',
  Redis: 'https://redis.io/docs/latest/',
  Docker: 'https://docs.docker.com/',
  'GSAP': 'https://gsap.com/docs/',
  'Framer Motion': 'https://www.framer.com/motion/',
  Vite: 'https://vite.dev/guide/',
  Linux: 'https://linux.die.net/',
  Git: 'https://git-scm.com/doc',
}

export const SKILL_LIBRARY = {
  typescript: skill({
    id: 'typescript',
    name: 'TypeScript',
    category: 'Language',
    yearsUsed: '4+ yrs',
    proficiency: 5,
    description: 'The glue for typed APIs, UI contracts, and tooling that does not drift.',
    useCases: ['Shared schemas', 'API clients', 'Tooling'],
    variant: 'v-accent',
    docsUrl: DOCS.TypeScript,
  }),
  nodejs: skill({
    id: 'nodejs',
    name: 'Node.js',
    category: 'Runtime',
    yearsUsed: '4+ yrs',
    proficiency: 5,
    description: 'Primary backend runtime for APIs, workers, and small command-line utilities.',
    useCases: ['HTTP services', 'Workers', 'CLI tools'],
    variant: 'v-ink',
    docsUrl: DOCS['Node.js'],
  }),
  express: skill({
    id: 'express',
    name: 'Express',
    category: 'Web framework',
    yearsUsed: '4+ yrs',
    proficiency: 5,
    description: 'My default HTTP layer for fast routes, middleware, and auth-heavy services.',
    useCases: ['REST APIs', 'Middleware stacks', 'Auth flows'],
    variant: 'v-accent',
    docsUrl: DOCS.Express,
  }),
  postgresql: skill({
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    yearsUsed: '4+ yrs',
    proficiency: 5,
    description: 'Primary relational store for schema design, migrations, and query tuning.',
    useCases: ['Schema design', 'Query tuning', 'Migrations'],
    variant: 'v-ink',
    docsUrl: DOCS.PostgreSQL,
  }),
  redis: skill({
    id: 'redis',
    name: 'Redis',
    category: 'Cache / Queue',
    yearsUsed: '3+ yrs',
    proficiency: 4,
    description: 'Used for cache layers, queues, rate limits, and the occasional rescue rope.',
    useCases: ['Caching', 'Job queues', 'Rate limiting'],
    variant: 'v-accent',
    docsUrl: DOCS.Redis,
  }),
  docker: skill({
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    yearsUsed: '3+ yrs',
    proficiency: 4,
    description: 'Keeps local and production environments boring in the best possible way.',
    useCases: ['Service isolation', 'Deploy parity', 'Local stacks'],
    variant: 'v-ink',
    docsUrl: DOCS.Docker,
  }),
  gsap: skill({
    id: 'gsap',
    name: 'GSAP',
    category: 'Motion',
    yearsUsed: '3+ yrs',
    proficiency: 4,
    description: 'The timing engine behind scroll reveals, sequencing, and interfaces with weight.',
    useCases: ['Scroll choreography', 'Sequence timing', 'Hero reveals'],
    variant: 'v-accent',
    docsUrl: DOCS.GSAP,
  }),
  framerMotion: skill({
    id: 'framer-motion',
    name: 'Framer Motion',
    category: 'Motion',
    yearsUsed: '3+ yrs',
    proficiency: 4,
    description: 'Gesture handling, transitions, and spring physics when the interface needs polish.',
    useCases: ['Gestures', 'Spring motion', 'Micro-interactions'],
    variant: 'v-ink',
    docsUrl: DOCS['Framer Motion'],
  }),
  vite: skill({
    id: 'vite',
    name: 'Vite',
    category: 'Build tool',
    yearsUsed: '3+ yrs',
    proficiency: 4,
    description: 'Fast local feedback loops and a clean build pipeline for modern React apps.',
    useCases: ['Builds', 'Dev server', 'Bundling'],
    variant: 'v-accent',
    docsUrl: DOCS.Vite,
  }),
  linux: skill({
    id: 'linux',
    name: 'Linux',
    category: 'Environment',
    yearsUsed: '5+ yrs',
    proficiency: 5,
    description: 'The daily operating system for shells, services, deploys, and the rest of the mess.',
    useCases: ['Shell work', 'Servers', 'Automation'],
    variant: 'v-ink',
    docsUrl: DOCS.Linux,
  }),
  git: skill({
    id: 'git',
    name: 'Git',
    category: 'Version control',
    yearsUsed: '5+ yrs',
    proficiency: 5,
    description: 'The least glamorous skill, which is exactly why it matters this much.',
    useCases: ['Branching', 'Code review', 'Release flow'],
    variant: 'v-accent',
    docsUrl: DOCS.Git,
  }),
}

export const SKILL_ORDER = [
  'typescript',
  'nodejs',
  'express',
  'postgresql',
  'redis',
  'docker',
  'gsap',
  'framerMotion',
  'vite',
  'linux',
  'git',
]

export const FALLBACK_SKILLS = SKILL_ORDER.map((key) => SKILL_LIBRARY[key])

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/next\.js/g, 'nextjs')
    .replace(/framer motion/g, 'framermotion')
    .replace(/node\.js/g, 'nodejs')
    .replace(/[^a-z0-9]+/g, '')

export function buildSkillsFromRows(rows = []) {
  const byId = new Map(
    Object.values(SKILL_LIBRARY).map((item) => [slugify(item.id), item])
  )
  const byName = new Map(
    Object.values(SKILL_LIBRARY).map((item) => [slugify(item.name), item])
  )
  const seen = new Set()
  const ordered = []

  const push = (item) => {
    if (!item || seen.has(item.id)) return
    ordered.push(item)
    seen.add(item.id)
  }

  rows.forEach((row) => {
    const item = byId.get(slugify(row?.name)) || byName.get(slugify(row?.name))
    if (item) push(item)
  })

  FALLBACK_SKILLS.forEach(push)

  return ordered.slice(0, 12)
}
