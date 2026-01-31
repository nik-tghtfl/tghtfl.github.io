# Deployment Guide for GitHub Pages

## Automatic Deployment (Recommended)

### Option 1: GitHub Actions Workflow

1. **Update your Personal Access Token** to include the `workflow` scope:
   - Go to: https://github.com/settings/tokens
   - Edit your existing token or create a new one
   - Check the `workflow` scope
   - Save the token

2. **Add the workflow file**:
   - Create `.github/workflows/deploy.yml` in your repository
   - Copy the content from the workflow file below
   - Commit and push (you'll need the updated token with workflow scope)

3. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Source: Select "GitHub Actions"
   - The workflow will automatically deploy on every push to `main`

### Option 2: Manual Deployment

1. **Build the project locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the `out` directory**:
   - The build creates an `out/` directory with static files
   - You can use GitHub Pages settings to deploy from a branch, or
   - Push the `out` directory contents to a `gh-pages` branch

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select the branch containing your built files
   - Save

## GitHub Actions Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## After Deployment

Your site will be available at:
- `https://nik-tghtfl.github.io/tghtfl.github.io/` (if using project pages)
- Or `https://tghtfl.github.io/` (if repository is named correctly for user/organization pages)
