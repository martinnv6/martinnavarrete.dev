# martinnavarrete.dev

Personal site for **Martín Navarrete**: Technical Lead and Senior Software Engineer. Separate views for engineering leadership roles (`/leadership/`) and senior engineering roles (`/engineering/`).

## 🚀 Live Domain
- Production (canonical): [https://martinnavarrete.dev](https://martinnavarrete.dev)
- `www.martinnavarrete.dev` must redirect (301) to the canonical host; see [Fixing `www`](#fixing-www) below
- Registrar: Cloudflare Registrar
- Hosting: Cloudflare Workers static assets, deployed by **Workers Builds** (`martinnavarrete-dev`) on every push. Pushes to `main` go to production; other branches get a preview build.
- GitHub Pages is also enabled on this repo (it still records `github-pages` deployments from `main`). Cloudflare serves the domain, so GitHub Pages is unused: turn it off in the repo's Settings → Pages to avoid confusion. The `CNAME` file only matters to GitHub Pages.
- SSL: Automated via Cloudflare Edge (HSTS Preloaded)

## 📁 Repository Structure

The site has three pages so each audience lands on what matters to them:

| Route | Audience | Content |
|---|---|---|
| `/` | Everyone | Short intro, two "pick your view" cards, career at a glance, contact |
| `/leadership/` | Hiring managers for engineering leadership roles | Teams led (size, makeup, results), how I lead, DellRewards case study, what I'm looking for, leadership CV (EN/ES) |
| `/engineering/` | Hiring managers for senior engineering / architect roles | Technical timeline with filters, projects, skills matrix, education |

```text
martinnavarrete.dev/
├── index.html              # Overview (/)
├── leadership/index.html   # /leadership/
├── engineering/index.html  # /engineering/
├── 404.html                # Custom not-found page (served when the Worker's assets use not_found_handling = "404-page")
├── sitemap.xml
├── style.css               # Shared design tokens, dark/light themes, responsive layout
├── app.js                  # Theme toggle, experience filters, resume dialog, mobile nav
├── assets/
│   └── resumes/
│       ├── Martin_Navarrete_AI_Engineering_Leadership.pdf      # Leadership CV (EN)
│       ├── Martin_Navarrete_AI_Engineering_Leadership_ES.pdf   # Leadership CV (ES)
│       ├── Martin_Navarrete_Senior_Software_Engineer.pdf
│       ├── Martin_Navarrete_Principal_Software_Architect.pdf
│       ├── Martin_Navarrete_Senior_AI_Engineer.pdf
│       └── Martin_Navarrete_ML_Engineer.pdf
└── README.md
```

Every page is plain HTML with the same header, contact section, footer and resume dialog, so it works without a build step. When you change one of those shared parts, change it in all four HTML files. All asset links are root-relative (`/style.css`, `/assets/...`), so preview the site from the repo root (see Local Testing below), not by opening the files directly.

Content rule: only confirmed facts and metrics. The leadership CV source of truth is `Job-Seeking-2026/Resumes/2026-11_Ternium_MichaelPage/` (`CV_Martin_Navarrete_EN.md` / `_ES.md`).

## 🛠️ Step-by-Step: 2-Minute Deployment to Cloudflare Pages ($0/mo Forever)

> The live site ended up on Cloudflare Workers (Workers Builds, see Live Domain above). These original Pages steps are kept for reference.

Since your domain **`martinnavarrete.dev`** is already registered directly with Cloudflare, deploying is seamless with zero DNS configuration headaches:

### Step 1: Create a GitHub Repository
1. On GitHub ([github.com/new](https://github.com/new)), create a repository named:
   `martinnavarrete.dev` (or `portfolio`)
2. Push this local directory to GitHub:
   ```bash
   cd "/home/martin/Documents/Repos/martinnavarrete.dev"
   git init
   git add .
   git commit -m "Initial release: High-performance portfolio for martinnavarrete.dev"
   git branch -M main
   git remote add origin https://github.com/martinnv6/martinnavarrete.dev.git
   git push -u origin main
   ```

### Step 2: Connect to Cloudflare Pages
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your GitHub account (`martinnv6`) and select the `martinnavarrete.dev` repository.
4. Set up the build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave blank)*
   - **Build output directory**: `.` *(current directory)*
5. Click **Save and Deploy**. In ~15 seconds, your site is built and live on a `*.pages.dev` preview URL!

### Step 3: Link Your Custom Domain
1. In your new Cloudflare Pages project, go to the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter `martinnavarrete.dev` and click **Continue**.
4. Since your domain is already in your Cloudflare account, click **Activate domain**. Cloudflare will automatically configure the DNS records and issue an edge SSL certificate.
5. Then do the [`www` fix](#fixing-www) below. Without it, `www.martinnavarrete.dev` does not resolve at all.

---

## Fixing `www`

**Symptom:** `https://martinnavarrete.dev` loads, `https://www.martinnavarrete.dev` fails to connect (a network-level failure, not an HTTP error page).

**Cause:** the `www` hostname was never set up. The original deployment steps only attached the bare domain to the Cloudflare project, and `www` was left as an optional step, so there is no `www` DNS record. A `CNAME` file in the repo cannot create one: Cloudflare ignores it.

**Fix (Cloudflare dashboard, about 5 minutes; nothing in this repo can do it):**
1. **DNS** &rarr; **Records** &rarr; add a record: type `A`, name `www`, IPv4 `192.0.2.1`, **Proxied** (orange cloud). The address is a placeholder; the proxy answers the request, so the redirect below can fire.
2. **Rules** &rarr; **Redirect Rules** &rarr; **Create rule** ("Redirect from WWW to root"):
   - When incoming requests match: Custom filter expression, Hostname **equals** `www.martinnavarrete.dev`
   - Then: Dynamic redirect, expression `concat("https://martinnavarrete.dev", http.request.uri.path)`, status **301**, preserve query string
3. Check: `curl -I https://www.martinnavarrete.dev/` should return `301` with `location: https://martinnavarrete.dev/`.

Alternative: attach `www.martinnavarrete.dev` as a second custom domain on the Worker (Settings → Domains & Routes) (it then serves the same site with no redirect). The redirect is preferred so there is a single canonical URL; the page already declares `<link rel="canonical" href="https://martinnavarrete.dev/">`.

---

## 💻 Local Testing & Preview
To preview the website locally anytime:
```bash
python3 -m http.server 8080 --directory "/home/martin/Documents/Repos/martinnavarrete.dev"
```
Then open `http://localhost:8080` in your web browser.
