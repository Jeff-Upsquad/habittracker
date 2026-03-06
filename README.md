# GridMyHabits

A lightweight, static web app for tracking multiple habits in a grid-style UI.

If you're **not a programmer**, don't worry — you can still publish this site by following the click-by-click steps below.

---

## What this app does

- Lets you create and track **multiple habits**.
- Click a square (or **Mark Today**) to mark completion.
- Shows total days and streak stats.
- Saves your data in your browser (`localStorage`).

> Important: because data is stored in the browser, each browser/device keeps its own data.

---

## Files you need to upload

Only these 3 files are required for the website to run:

- `index.html`
- `styles.css`
- `app.js`

---

## Easiest path (for non-programmers): Hostinger File Manager

### Step 1: Open your Hostinger panel
1. Log in to Hostinger.
2. Open **hPanel**.
3. Go to **Hosting** → **Manage** (for your domain).

### Step 2: Open your website folder
1. Click **File Manager**.
2. Open folder `public_html`.

### Step 3: Remove default page (if needed)
If you see a default file like `index.php`, rename it to `index_old.php` (or delete it).

### Step 4: Upload app files
Upload these files into `public_html`:

- `index.html`
- `styles.css`
- `app.js`

After upload, all 3 files should be directly inside `public_html` (not inside another nested folder).

### Step 5: Turn on SSL
1. In hPanel, open **SSL**.
2. Activate SSL for your domain.
3. Enable **Force HTTPS**.

### Step 6: Open your site
Visit:

- `https://yourdomain.com`

If everything worked, you should see the GridMyHabits page.

---

## Alternative: Upload by ZIP in File Manager

If uploading one-by-one is annoying, zip the files first.

Create zip (on this project folder):

```bash
cd /workspace/habittracker
zip -r habittracker-deploy.zip index.html styles.css app.js
```

Then in Hostinger File Manager:
1. Upload `habittracker-deploy.zip` to `public_html`.
2. Extract it.
3. Confirm the 3 files are in `public_html`.

---

## How to check your app is working

After opening your domain:

1. Add a habit (example: `Reading`).
2. Click **Mark Today**.
3. Refresh the page.
4. Confirm the habit and marked day are still there.

If yes, deployment is successful.

---

## Common problems (simple fixes)

- **Page shows old content**
  - Hard refresh with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac).
  - Clear Hostinger cache/CDN if enabled.

- **No design / broken layout**
  - `styles.css` is missing or not in the same folder as `index.html`.

- **Buttons do nothing**
  - `app.js` is missing or not in the same folder as `index.html`.

- **Domain not opening**
  - DNS may still be propagating (can take a few hours).

- **Still seeing Hostinger default page**
  - Old `index.php` is still taking priority. Rename/delete it.

---

## Optional: FTP upload (advanced)

Use FileZilla if you prefer FTP/SFTP:

- Host: from Hostinger hPanel
- Username/password: from Hostinger hPanel
- Port: `21` (FTP) or `22` (SFTP)
- Upload destination: `public_html`

Upload `index.html`, `styles.css`, and `app.js`.

---

## Updating your live site later

When you edit your app in future:

1. Re-upload changed files to `public_html`.
2. Hard refresh the browser.
3. If cache is enabled, purge cache.
