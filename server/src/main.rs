use actix_cors::Cors;
use actix_web::{
    delete, get, middleware::Logger, post, put, web, App, HttpRequest, HttpResponse, HttpServer,
    Responder,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, FromRow, PgPool};

#[derive(Clone)]
struct AppState {
    pool: PgPool,
    admin_token: String,
}

#[derive(Serialize, Deserialize, FromRow)]
struct Project {
    id: i32,
    key: String,
    title: String,
    url: String,
    description: String,
    tags: Vec<String>,
    bg: String,
    fg: String,
    accent: String,
    mark: String,
    position: i32,
}

#[derive(Deserialize)]
struct ProjectInput {
    key: String,
    title: String,
    #[serde(default)]
    url: String,
    #[serde(default)]
    description: String,
    #[serde(default)]
    tags: Vec<String>,
    #[serde(default = "default_bg")]
    bg: String,
    #[serde(default = "default_fg")]
    fg: String,
    #[serde(default = "default_accent")]
    accent: String,
    #[serde(default)]
    mark: String,
    #[serde(default)]
    position: i32,
}

fn default_bg() -> String {
    "linear-gradient(135deg, #33456b 0%, #131b2b 60%, #06080d 100%)".into()
}
fn default_fg() -> String {
    "#e8e4dc".into()
}
fn default_accent() -> String {
    "#ff4d00".into()
}

#[derive(Serialize, Deserialize, FromRow)]
struct Skill {
    id: i32,
    name: String,
    variant: String,
    position: i32,
}

#[derive(Deserialize)]
struct SkillInput {
    name: String,
    #[serde(default)]
    variant: String,
    #[serde(default)]
    position: i32,
}

fn authed(req: &HttpRequest, state: &AppState) -> bool {
    req.headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .map(|t| !state.admin_token.is_empty() && t == state.admin_token)
        .unwrap_or(false)
}

macro_rules! require_auth {
    ($req:expr, $state:expr) => {
        if !authed(&$req, &$state) {
            return HttpResponse::Unauthorized().json(serde_json::json!({"error": "unauthorized"}));
        }
    };
}

#[get("/api/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({"status": "ok"}))
}

#[get("/api/content")]
async fn get_content(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, (String, serde_json::Value)>("SELECT key, value FROM settings")
        .fetch_all(&state.pool)
        .await
    {
        Ok(rows) => {
            let mut map = serde_json::Map::new();
            for (k, v) in rows {
                map.insert(k, v);
            }
            HttpResponse::Ok().json(serde_json::Value::Object(map))
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[put("/api/settings/{key}")]
async fn put_setting(
    req: HttpRequest,
    state: web::Data<AppState>,
    path: web::Path<String>,
    body: web::Json<serde_json::Value>,
) -> HttpResponse {
    require_auth!(req, state);
    match sqlx::query(
        "INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2",
    )
    .bind(path.into_inner())
    .bind(body.into_inner())
    .execute(&state.pool)
    .await
    {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"ok": true})),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[post("/api/auth/check")]
async fn auth_check(req: HttpRequest, state: web::Data<AppState>) -> impl Responder {
    if authed(&req, &state) {
        HttpResponse::Ok().json(serde_json::json!({"ok": true}))
    } else {
        HttpResponse::Unauthorized().json(serde_json::json!({"ok": false}))
    }
}

#[get("/api/projects")]
async fn list_projects(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Project>("SELECT * FROM projects ORDER BY position, id")
        .fetch_all(&state.pool)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[post("/api/projects")]
async fn create_project(
    req: HttpRequest,
    state: web::Data<AppState>,
    body: web::Json<ProjectInput>,
) -> HttpResponse {
    require_auth!(req, state);
    let p = body.into_inner();
    match sqlx::query_as::<_, Project>(
        "INSERT INTO projects (key, title, url, description, tags, bg, fg, accent, mark, position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
    )
    .bind(&p.key)
    .bind(&p.title)
    .bind(&p.url)
    .bind(&p.description)
    .bind(&p.tags)
    .bind(&p.bg)
    .bind(&p.fg)
    .bind(&p.accent)
    .bind(&p.mark)
    .bind(p.position)
    .fetch_one(&state.pool)
    .await
    {
        Ok(row) => HttpResponse::Ok().json(row),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[put("/api/projects/{id}")]
async fn update_project(
    req: HttpRequest,
    state: web::Data<AppState>,
    path: web::Path<i32>,
    body: web::Json<ProjectInput>,
) -> HttpResponse {
    require_auth!(req, state);
    let p = body.into_inner();
    match sqlx::query_as::<_, Project>(
        "UPDATE projects SET key=$1, title=$2, url=$3, description=$4, tags=$5, bg=$6, fg=$7, accent=$8, mark=$9, position=$10
         WHERE id=$11 RETURNING *",
    )
    .bind(&p.key)
    .bind(&p.title)
    .bind(&p.url)
    .bind(&p.description)
    .bind(&p.tags)
    .bind(&p.bg)
    .bind(&p.fg)
    .bind(&p.accent)
    .bind(&p.mark)
    .bind(p.position)
    .bind(path.into_inner())
    .fetch_one(&state.pool)
    .await
    {
        Ok(row) => HttpResponse::Ok().json(row),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[delete("/api/projects/{id}")]
async fn delete_project(
    req: HttpRequest,
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> HttpResponse {
    require_auth!(req, state);
    match sqlx::query("DELETE FROM projects WHERE id=$1")
        .bind(path.into_inner())
        .execute(&state.pool)
        .await
    {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"ok": true})),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[get("/api/skills")]
async fn list_skills(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as::<_, Skill>("SELECT * FROM skills ORDER BY position, id")
        .fetch_all(&state.pool)
        .await
    {
        Ok(rows) => HttpResponse::Ok().json(rows),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[post("/api/skills")]
async fn create_skill(
    req: HttpRequest,
    state: web::Data<AppState>,
    body: web::Json<SkillInput>,
) -> HttpResponse {
    require_auth!(req, state);
    let s = body.into_inner();
    match sqlx::query_as::<_, Skill>(
        "INSERT INTO skills (name, variant, position) VALUES ($1,$2,$3) RETURNING *",
    )
    .bind(&s.name)
    .bind(&s.variant)
    .bind(s.position)
    .fetch_one(&state.pool)
    .await
    {
        Ok(row) => HttpResponse::Ok().json(row),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[put("/api/skills/{id}")]
async fn update_skill(
    req: HttpRequest,
    state: web::Data<AppState>,
    path: web::Path<i32>,
    body: web::Json<SkillInput>,
) -> HttpResponse {
    require_auth!(req, state);
    let s = body.into_inner();
    match sqlx::query_as::<_, Skill>(
        "UPDATE skills SET name=$1, variant=$2, position=$3 WHERE id=$4 RETURNING *",
    )
    .bind(&s.name)
    .bind(&s.variant)
    .bind(s.position)
    .bind(path.into_inner())
    .fetch_one(&state.pool)
    .await
    {
        Ok(row) => HttpResponse::Ok().json(row),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

#[delete("/api/skills/{id}")]
async fn delete_skill(
    req: HttpRequest,
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> HttpResponse {
    require_auth!(req, state);
    match sqlx::query("DELETE FROM skills WHERE id=$1")
        .bind(path.into_inner())
        .execute(&state.pool)
        .await
    {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"ok": true})),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({"error": e.to_string()})),
    }
}

async fn migrate_and_seed(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            key TEXT NOT NULL,
            title TEXT NOT NULL,
            url TEXT NOT NULL DEFAULT '',
            description TEXT NOT NULL DEFAULT '',
            tags TEXT[] NOT NULL DEFAULT '{}',
            bg TEXT NOT NULL DEFAULT '',
            fg TEXT NOT NULL DEFAULT '#e8e4dc',
            accent TEXT NOT NULL DEFAULT '#ff4d00',
            mark TEXT NOT NULL DEFAULT '',
            position INT NOT NULL DEFAULT 0
        )",
    )
    .execute(pool)
    .await?;
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            variant TEXT NOT NULL DEFAULT '',
            position INT NOT NULL DEFAULT 0
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value JSONB NOT NULL DEFAULT '{}'
        )",
    )
    .execute(pool)
    .await?;

    let (count,): (i64,) = sqlx::query_as("SELECT COUNT(*) FROM projects")
        .fetch_one(pool)
        .await?;
    if count == 0 {
        log::info!("empty database — seeding with default content");
        sqlx::raw_sql(include_str!("seed.sql")).execute(pool).await?;
    }

    let (scount,): (i64,) = sqlx::query_as("SELECT COUNT(*) FROM settings")
        .fetch_one(pool)
        .await?;
    if scount == 0 {
        log::info!("seeding default site content");
        let defaults = serde_json::json!({
            "site": {
                "email": "brij19069@gmail.com",
                "github": "Brijnandan11",
                "linkedin": "https://linkedin.com",
                "x": "https://x.com",
                "note": "— usually replies within a day"
            },
            "hero": {
                "intro": "Full stack developer building *fast,* expressive products — from database schema to the last easing curve.",
                "roles": ["full stack developer", "creative engineer", "systems tinkerer"],
                "location": "Based on planet Earth\nWorking worldwide",
                "folio": "Folio / Vol. 2\n©2026"
            },
            "marquee": {
                "items": ["Full Stack Developer", "Creative Engineer", "Motion Enthusiast"]
            },
            "about": {
                "text": "I build products end to end — *resilient* *backends,* expressive frontends, and the infrastructure that keeps them alive. I obsess over *performance,* *craft,* and the tiny details most people never notice but everyone *feels.*",
                "stats": [
                    {"value": "2", "label": "Years shipping"},
                    {"value": "20", "label": "Projects delivered"},
                    {"value": "∞", "label": "Curiosity"}
                ]
            },
            "services": {
                "list": [
                    {"name": "Full Stack Development", "desc": "Complete products from schema to pixel — typed APIs, clean data models, and interfaces that feel inevitable."},
                    {"name": "Backend Architecture", "desc": "Services designed for load and failure — queues, caching layers, real-time pipelines, and the boring reliability that ships."},
                    {"name": "Creative Frontend", "desc": "GSAP, Framer Motion, WebGL-adjacent trickery — interfaces with weight, inertia, and intent. Motion as a feature, not garnish."},
                    {"name": "DevOps & Cloud", "desc": "Containers, CI/CD, observability, and infrastructure as code — deploys measured in minutes, incidents measured in calm."}
                ]
            },
            "terminal": {
                "bars": [
                    {"label": "TypeScript / React", "pct": 92},
                    {"label": "Node & APIs", "pct": 90},
                    {"label": "Rust & Systems", "pct": 78},
                    {"label": "DevOps / Cloud", "pct": 84}
                ]
            }
        });
        for (k, v) in defaults.as_object().unwrap() {
            sqlx::query("INSERT INTO settings (key, value) VALUES ($1, $2)")
                .bind(k)
                .bind(v)
                .execute(pool)
                .await?;
        }
    }
    Ok(())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        eprintln!("\n[x] DATABASE_URL is not set.");
        eprintln!("    1. Create a free project at https://neon.tech");
        eprintln!("    2. Copy the connection string into server/.env:");
        eprintln!("       DATABASE_URL=postgres://user:pass@host/db?sslmode=require\n");
        std::process::exit(1);
    });
    let admin_token = std::env::var("ADMIN_TOKEN").unwrap_or_else(|_| {
        eprintln!("\n[x] ADMIN_TOKEN is not set in server/.env — pick a long random string.\n");
        std::process::exit(1);
    });
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8787);

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("failed to connect to database — check DATABASE_URL");

    migrate_and_seed(&pool).await.expect("migration failed");
    log::info!("db ready — http://localhost:{port} (admin at /admin.html)");

    let state = AppState { pool, admin_token };

    HttpServer::new(move || {
        let mut app = App::new()
            .app_data(web::Data::new(state.clone()))
            .wrap(Logger::default())
            .wrap(Cors::permissive())
            .service(health)
            .service(get_content)
            .service(put_setting)
            .service(auth_check)
            .service(list_projects)
            .service(create_project)
            .service(update_project)
            .service(delete_project)
            .service(list_skills)
            .service(create_skill)
            .service(update_skill)
            .service(delete_skill);
        if std::path::Path::new("../dist").exists() {
            app = app
                .service(actix_files::Files::new("/", "../dist").index_file("index.html"));
        }
        app
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
