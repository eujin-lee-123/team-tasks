# Architecture

```
                ┌─────────────────────────┐
Browser ───────►│ Vercel · Next.js        │──► Supabase (Postgres + Auth)
                │ (Front-end + API Routes)│               │
                └─────────────────────────┘               │
                         └──── Google OAuth ◄─────────────┘
```
