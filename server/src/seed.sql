INSERT INTO projects (key, title, url, description, tags, bg, fg, accent, mark, position) VALUES
('sentinel-auth', 'Sentinel Auth', 'sentinel.example', 'A production-grade auth service with JWT, roles, and secure session flows — built to stay boring under pressure.', '{Rust,Actix,Redis,Docker}', 'linear-gradient(135deg, #ff4d00 0%, #7a1f00 55%, #1a0a04 100%)', '#ffe9df', '#0a0a0a', 'sa', 0),
('forge', 'Forge', 'forge.example', 'A command-line workflow toolkit for tracking repos, notes, and daily output — fast, lean, and easy to live in.', '{Go,Node,PostgreSQL,CLI}', 'linear-gradient(135deg, #d8d4cc 0%, #8a867d 55%, #24221f 100%)', '#171614', '#ff4d00', 'fg', 1),
('seatlock', 'Seatlock Engine', 'seatlock.example', 'A high-concurrency reservation engine using distributed locking and PostgreSQL — designed for the messy edge cases.', '{TypeScript,Redis,Nginx,Docker}', 'linear-gradient(135deg, #3a5f48 0%, #16241b 60%, #070b08 100%)', '#d9e8de', '#8fd6a5', 'sl', 2),
('portfolio', 'Portfolio OS', 'portfolio.example', 'A living portfolio with motion, content controls, and a terminal shell — writing-first, polished everywhere else.', '{React,Vite,GSAP,PostgreSQL}', 'linear-gradient(135deg, #33456b 0%, #131b2b 60%, #06080d 100%)', '#dbe4f5', '#7fa4f0', 'po', 3);

INSERT INTO skills (name, variant, position) VALUES
('TypeScript', 'v-accent', 0), ('React', '', 1), ('Next.js', 'v-ink', 2), ('Node.js', '', 3),
('Rust', 'v-ink', 4), ('Go', '', 5), ('PostgreSQL', '', 6), ('MongoDB', 'v-ink', 7),
('Redis', 'v-accent', 8), ('Docker', '', 9), ('AWS', 'v-ink', 10), ('GraphQL', '', 11),
('GSAP', 'v-accent', 12), ('Framer Motion', '', 13), ('Tailwind', 'v-ink', 14), ('Linux', '', 15),
('Python', '', 16), ('Kubernetes', 'v-ink', 17), ('Nginx', '', 18), ('Prisma', 'v-ink', 19),
('Vite', 'v-accent', 20), ('Three.js', '', 21), ('WebSockets', 'v-ink', 22), ('CI/CD', '', 23),
('Figma', 'v-accent', 24), ('Git', '', 25), ('Bun', 'v-ink', 26), ('Express', '', 27);
