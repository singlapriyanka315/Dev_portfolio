# Priyanka Singla Portfolio

Static portfolio site ready for free deployment.

## Files

- `index.html`
- `styles.css`
- `script.js`
- `Priyanka_Singla_Resume.pdf`

## Deploy On Netlify

### Option 1: Drag and drop

1. Open [Netlify](https://app.netlify.com/drop).
2. Drag this folder into the page.
3. Netlify will generate a public live link.

### Option 2: GitHub + Netlify

1. Push this folder to a GitHub repository.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click `Add new site`.
4. Click `Import an existing project`.
5. Select your GitHub repository.
6. Netlify will detect `netlify.toml`.
7. Click `Deploy site`.

## Deploy On GitHub Pages

1. Push this folder to a GitHub repository.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
5. Click `Save`.
6. GitHub will give you a live URL.

## Notes

- `.nojekyll` is included so GitHub Pages serves the site as plain static files.
- `netlify.toml` is included so Netlify knows to publish the current folder.
