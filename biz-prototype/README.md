# Nexa Ops Demo

Prototype SaaS admin dashboard for business and project management.

## Run locally

```bash
cd /home/mayao4/.openclaw/workspace/biz-prototype
npm install
npm run dev
```

Open the URL shown by Vite, usually:

```bash
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Edit data inside the app

- Click **Open editor** in the top bar
- Modify dashboard, projects, tasks, CRM, and team data
- Changes are saved to **localStorage** automatically
- Refresh will keep edited data

## Export / Import

Inside the editor:
- **Export JSON** downloads the full demo data as `nexa-ops-data.json`
- **Import JSON** loads a previously exported JSON file
- **Reset dữ liệu mẫu** restores defaults and clears localStorage

## Save to a real file

The app can export the current dataset to a real JSON file on your machine.
That file can be versioned, shared, and imported later.

## Publish ready

This project is Vite-based and can be deployed easily to:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

### Netlify
Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

### Vercel
Framework preset:

```bash
Vite
```

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```
