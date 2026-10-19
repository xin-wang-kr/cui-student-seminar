# CUI Student Seminar sign-up page

- `index.html` – the landing page + survey (single static file, no build step).
- `Code.gs` – Google Apps Script that appends each response as a row in a Google Sheet.

## 1. Connect the Google Sheet (≈5 min)

1. Create a new Google Sheet (e.g. "CUI Student Seminar – Responses"), ideally in a shared organizer account.
2. **Extensions › Apps Script**. Delete the sample code, paste the contents of `Code.gs`, save.
3. **Deploy › New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when prompted (choose "Advanced › Go to project" on the unverified-app screen; it's your own script).
5. Copy the **Web app URL** (ends in `/exec`).
6. In `index.html`, set `APPS_SCRIPT_URL` to that URL. Also set `SEMINAR_PAGE_URL` once the seminar page exists.

The first submission creates a `Responses` tab with a header row (one column per question, plus a server timestamp). Multi-select answers are joined with `; `. Attendees who choose "No, but I'd like to attend" leave Sections 2–3 blank.

> If you edit `Code.gs` later, use **Deploy › Manage deployments › Edit › New version** so the URL stays the same.

## 2. Host the page

Any static host works: the ACM CUI website itself, GitHub Pages, Netlify, or Google Sites (embed). For GitHub Pages: push this folder to a repo, then Settings › Pages › deploy from branch.

To test locally: `python3 -m http.server` in this folder, then open http://localhost:8000.

## Editing questions

All questions live in the `SECTIONS` array in `index.html`. Each question's `col` is its column header in the sheet; adding a question adds a new column automatically.
