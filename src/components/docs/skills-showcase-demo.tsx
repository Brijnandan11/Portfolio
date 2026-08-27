import { SkillsShowcase, SkillCfg } from "@/components/ui/skills-showcase";

const MY_SKILLS: SkillCfg[] = [
  {
    id: "nginx",
    name: "Nginx",
    category: "Web Server",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Edge routing, reverse proxying, and static delivery in front of the app.",
    useCases: ["Reverse proxy", "Static assets", "Load balancing"],
  },
  {
    id: "docker",
    name: "Docker",
    category: "Infra",
    yearsUsed: "3+ yrs",
    proficiency: 4,
    description: "Containerizing services for consistent local/prod parity.",
    useCases: ["Local dev envs", "CI pipelines", "Deployment"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "Cache / Queue",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Caching, rate limiting, and distributed locking layer.",
    useCases: ["Caching", "Rate limiting", "Distributed locks"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Language",
    yearsUsed: "4+ yrs",
    proficiency: 5,
    description: "The glue for typed APIs, UI contracts, and tooling that does not drift.",
    useCases: ["Shared schemas", "API clients", "Tooling"],
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "Orchestration",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Container orchestration for repeatable deploys and saner scaling.",
    useCases: ["Deployments", "Service discovery", "Scaling"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    yearsUsed: "3+ yrs",
    proficiency: 4,
    description: "Interface planning, layout exploration, and handoff for real builds.",
    useCases: ["Wireframes", "UI systems", "Prototyping"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    yearsUsed: "4+ yrs",
    proficiency: 5,
    description: "Primary relational store for schema design, migrations, and query tuning.",
    useCases: ["Schema design", "Query tuning", "Migrations"],
  },
  {
    id: "gsap",
    name: "GSAP",
    category: "Motion",
    yearsUsed: "3+ yrs",
    proficiency: 4,
    description: "The timing engine behind scroll reveals, sequencing, and interfaces with weight.",
    useCases: ["Scroll choreography", "Sequence timing", "Hero reveals"],
  },
  {
    id: "graphql",
    name: "GraphQL",
    category: "API Layer",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Typed query layer for data-heavy client/server contracts.",
    useCases: ["Schemas", "Queries", "Type-safe clients"],
  },
  {
    id: "go",
    name: "Go",
    category: "Language",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Fast, simple services and tooling where concurrency matters.",
    useCases: ["CLI tools", "APIs", "Workers"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Runtime",
    yearsUsed: "4+ yrs",
    proficiency: 5,
    description: "Primary backend runtime for APIs, workers, and small command-line utilities.",
    useCases: ["HTTP services", "Workers", "CLI tools"],
  },
  {
    id: "linux",
    name: "Linux",
    category: "Environment",
    yearsUsed: "5+ yrs",
    proficiency: 5,
    description: "The daily operating system for shells, services, deploys, and the rest of the mess.",
    useCases: ["Shell work", "Servers", "Automation"],
  },
  {
    id: "framer-motion",
    name: "Framer Motion",
    category: "Motion",
    yearsUsed: "3+ yrs",
    proficiency: 4,
    description: "Gesture handling, transitions, and spring physics when the interface needs polish.",
    useCases: ["Gestures", "Spring motion", "Micro-interactions"],
  },
  {
    id: "typescript-alt",
    name: "TypeScript",
    category: "Language",
    yearsUsed: "3+ yrs",
    proficiency: 5,
    description: "Type-safe language for typed APIs, UI contracts, and tooling.",
    useCases: ["Typed APIs", "Shared schemas", "Tooling"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Database",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Document storage for flexible data shapes and evolving schemas.",
    useCases: ["Document models", "Aggregation", "Prototyping"],
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "3D",
    yearsUsed: "1+ yrs",
    proficiency: 3,
    description: "WebGL scenes, camera motion, and 3D flourishes when the UI needs depth.",
    useCases: ["3D scenes", "Materials", "Spatial UI"],
  },
  {
    id: "drizzle",
    name: "Drizzle",
    category: "ORM",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Lightweight, type-safe ORM with SQL-like query builder for TypeScript apps.",
    useCases: ["Schemas", "Migrations", "Type-safe queries"],
  },
  {
    id: "websockets",
    name: "WebSockets",
    category: "Realtime",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Realtime channels for live updates, presence, and push-driven UX.",
    useCases: ["Live updates", "Presence", "Streaming events"],
  },
  {
    id: "react",
    name: "React",
    category: "UI Library",
    yearsUsed: "4+ yrs",
    proficiency: 5,
    description: "Component-driven interfaces and interactive product surfaces.",
    useCases: ["Component systems", "Stateful UIs", "Design systems"],
  },
  {
    id: "tailwind",
    name: "Tailwind",
    category: "Styling",
    yearsUsed: "3+ yrs",
    proficiency: 5,
    description: "Utility-first styling for quickly shipping polished UI systems.",
    useCases: ["Layout systems", "Components", "Responsive UI"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Framework",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "React framework for full-stack rendering patterns and app routing.",
    useCases: ["Routing", "Server rendering", "App structure"],
  },
  {
    id: "git",
    name: "Git",
    category: "Version Control",
    yearsUsed: "5+ yrs",
    proficiency: 5,
    description: "The least glamorous skill, which is exactly why it matters this much.",
    useCases: ["Branching", "Code review", "Release flow"],
  },
  {
    id: "python",
    name: "Python",
    category: "Language",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Automation, scripts, and data tasks where speed of writing matters.",
    useCases: ["Automation", "Scripting", "Data tooling"],
  },
  {
    id: "lua",
    name: "Lua",
    category: "Language",
    yearsUsed: "1+ yrs",
    proficiency: 3,
    description: "Embedded scripting where a small, fast runtime beats a whole toolchain.",
    useCases: ["Neovim config", "Redis scripts", "Gateway logic"],
  },
  {
    id: "cicd",
    name: "CI/CD",
    category: "Delivery",
    yearsUsed: "3+ yrs",
    proficiency: 4,
    description: "Repeatable build and deploy pipelines for shipping with less drama.",
    useCases: ["Build pipelines", "Deploys", "Checks"],
  },
  {
    id: "vite",
    name: "Vite",
    category: "Build Tool",
    yearsUsed: "3+ yrs",
    proficiency: 4,
    description: "Fast local feedback loops and a clean build pipeline for modern React apps.",
    useCases: ["Builds", "Dev server", "Bundling"],
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    yearsUsed: "2+ yrs",
    proficiency: 4,
    description: "Infrastructure building blocks for deployment, storage, and compute.",
    useCases: ["Compute", "Storage", "Deployment"],
  },
];

export function SkillsShowcaseDemo() {
  const onViewProjects = (_skill: SkillCfg) => {
    const workSection = document.getElementById('work')
    const lenis = window as Window & {
      lenis?: {
        scrollTo: (target: string | Element, options?: { duration?: number; offset?: number }) => void
      }
    }

    if (workSection && lenis.lenis) {
      lenis.lenis.scrollTo(workSection, { duration: 1.2, offset: -24 })
      return
    }

    workSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="h-[720px] w-full">
      <SkillsShowcase
        skills={MY_SKILLS}
        heroTitle="SKILLS"
        navTitle="TOOLBOX"
        className="min-h-0"
        showDetailPanel={true}
        onViewProjects={onViewProjects}
      />
    </div>
  );
}

export default SkillsShowcaseDemo;
