# Shepherding Journal — Free Mobile App

This is a lightweight, mobile-first Progressive Web App (PWA).

## What is included

- Shepherding Journal
  - Month and week selection
  - 12 prayer-hour entries
  - 10 shepherding activities
  - Comments
  - Service / meeting attendance
- Weekly Cell Activity Report
- Monthly Cell Activity Report
- Automatic local saving in the browser
- Offline support after the app has been opened once
- Export/import backup
- No external JavaScript libraries, trackers or database
- Responsive design for iPhone, Android, tablet and desktop

## Important

This first version stores entries only on the device/browser using localStorage.
Do not put member information into the GitHub repository itself.

If the site is hosted on GitHub Pages, the repository/source is public when using GitHub Free. The data you enter is not written into the repository; it remains in the browser on the device.

## Free GitHub Pages setup

1. Create a free GitHub account at github.com.
2. Create a new PUBLIC repository, e.g. `shepherding-journal`.
3. Upload every file in this folder to the repository root.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose the `main` branch and `/ (root)`.
7. Save.
8. GitHub will give you a `github.io` website address.
9. Open that address on your iPhone in Safari.
10. Tap Share → Add to Home Screen.

## Updating the app

Replace the files in the repository with the newer files. The service worker cache version should be changed if you make major updates.

## Future upgrade

If you later need the same records to sync between several phones, a login + cloud database can be added. The current version deliberately avoids a database so it can stay free and very fast.
