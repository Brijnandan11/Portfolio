INSERT INTO projects (key, title, url, description, tags, bg, fg, accent, mark, position) VALUES
('ferrox', 'Ferrox Gateway', 'ferrox.dev', 'A high-throughput API gateway written in Rust — rate limiting, auth, and observability at the edge, benchmarked in the tens of thousands of requests per second.', '{Rust,Actix,Redis,Docker}', 'linear-gradient(135deg, #ff4d00 0%, #7a1f00 55%, #1a0a04 100%)', '#ffe9df', '#0a0a0a', 'fx', 0),
('curateme', 'CurateMe Studio', 'curateme.studio', 'A full-stack creator platform with curated collections, real-time collaboration, and a custom CMS — built for speed and editorial polish.', '{Next.js,Node,PostgreSQL,WebSockets}', 'linear-gradient(135deg, #d8d4cc 0%, #8a867d 55%, #24221f 100%)', '#171614', '#ff4d00', 'cm', 1),
('textile', 'Textile Flow', 'textileflow.app', 'An end-to-end manufacturing ERP handling orders, inventory, and dispatch for textile units — offline-tolerant, multi-tenant, battle-tested on the factory floor.', '{React,Express,MongoDB,Docker}', 'linear-gradient(135deg, #3a5f48 0%, #16241b 60%, #070b08 100%)', '#d9e8de', '#8fd6a5', 'tf', 2),
('blogify', 'Blogify', 'blogify.ink', 'A minimal publishing engine with markdown pipelines, edge caching, and sub-second page loads — writing-first, everything else second.', '{React,Go,SQLite,Fly.io}', 'linear-gradient(135deg, #33456b 0%, #131b2b 60%, #06080d 100%)', '#dbe4f5', '#7fa4f0', 'bl', 3);

INSERT INTO skills (name, variant, position) VALUES
('TypeScript', 'v-accent', 0), ('React', '', 1), ('Next.js', 'v-ink', 2), ('Node.js', '', 3),
('Rust', 'v-ink', 4), ('Go', '', 5), ('PostgreSQL', '', 6), ('MongoDB', 'v-ink', 7),
('Redis', 'v-accent', 8), ('Docker', '', 9), ('AWS', 'v-ink', 10), ('GraphQL', '', 11),
('GSAP', 'v-accent', 12), ('Framer Motion', '', 13), ('Tailwind', 'v-ink', 14), ('Linux', '', 15),
('Python', '', 16), ('Kubernetes', 'v-ink', 17), ('Nginx', '', 18), ('Prisma', 'v-ink', 19),
('Vite', 'v-accent', 20), ('Three.js', '', 21), ('WebSockets', 'v-ink', 22), ('CI/CD', '', 23),
('Figma', 'v-accent', 24), ('Git', '', 25), ('Bun', 'v-ink', 26), ('Express', '', 27);
