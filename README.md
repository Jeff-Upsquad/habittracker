# GridMyHabits

A lightweight, static web app for tracking multiple habits in a grid-style UI.

## Project files

- `index.html`
- `styles.css`
- `app.js`

Because this app is fully static (no backend), it can be hosted on Hostinger Shared Hosting using File Manager or FTP.

---

## Deploy to Hostinger (Shared Hosting)

### 1) Prepare the upload package
From this project directory, create a clean zip that includes only runtime files:

```bash
cd /workspace/habittracker
zip -r habittracker-deploy.zip index.html styles.css app.js
```

### 2) Point your domain to Hostinger
In **hPanel**:

1. Open **Domains** and ensure your domain uses Hostinger nameservers (or proper A record).
2. Wait for DNS propagation if you just changed records.

### 3) Upload the app files
In **hPanel → Hosting → Manage → File Manager**:

1. Go to `public_html/` (or your addon domain folder).
2. Upload `habittracker-deploy.zip`.
3. Extract it.
4. Confirm these files are in the web root:
   - `index.html`
   - `styles.css`
   - `app.js`

> If there is an old `index.php`, remove or rename it so `index.html` is served.

### 4) Enable SSL (recommended)
In **hPanel → SSL**:

1. Activate SSL for the domain.
2. Enable **Force HTTPS**.

This ensures browser storage (`localStorage`) works consistently in production and users see a secure site.

### 5) Verify in browser
Open:

- `https://yourdomain.com/`

Check:

- App loads with styling.
- You can add multiple habits.
- `Mark Today` toggles today’s cell.
- Refresh preserves data (localStorage).

---

## Optional: Deploy with FTP (instead of File Manager)

Use any FTP client (FileZilla):

- Host: your FTP hostname from Hostinger
- User / Password: from hPanel
- Port: 21 (FTP) or 22 (SFTP)
- Remote path: `public_html/`

Upload `index.html`, `styles.css`, and `app.js`.

---

## Troubleshooting

- **Blank page / missing styles**: confirm `styles.css` and `app.js` are in the same folder as `index.html`.
- **Old version still showing**: hard refresh (`Ctrl+Shift+R`) and clear Hostinger cache/CDN cache if enabled.
- **Domain not loading**: verify nameservers / DNS records and wait for propagation.
- **Permission issues**: set files to `644`, folders to `755`.

---

## Update workflow (after initial launch)

When you change the app locally:

1. Re-upload updated `index.html`, `styles.css`, `app.js`.
2. Hard refresh the browser.
3. If caching is enabled, purge cache.
