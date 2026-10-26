# martinnavarrete.dev

Personal portfolio and engineering showcase for **Martin Navarrete**, Senior Software Engineer & Distributed Systems Architect.

## 🚀 Live Domain
- Production: [https://www.martinnavarrete.dev](https://www.martinnavarrete.dev)
- Registrar: Cloudflare Registrar
- Hosting: Cloudflare Pages (or GitHub Pages)
- SSL: Automated via Cloudflare Edge (HSTS Preloaded)

## 📁 Repository Structure

```text
martinnavarrete.dev/
├── index.html          # Semantic HTML5 with accessibility & OpenGraph tags
├── style.css           # Modern CSS tokens, dark mode, glassmorphism, responsive
├── app.js              # Vanilla JS: Theme switcher, experience filters, resume modal
├── assets/
│   └── resumes/        # Production PDF resumes for download
│       ├── Martin_Navarrete_Senior_Software_Engineer.pdf
│       ├── Martin_Navarrete_Principal_Software_Architect.pdf
│       ├── Martin_Navarrete_Senior_AI_Engineer.pdf
│       └── Martin_Navarrete_ML_Engineer.pdf
└── README.md
```

## 🛠️ Step-by-Step: 2-Minute Deployment to Cloudflare Pages ($0/mo Forever)

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
5. (Optional) Repeat the step for `www.martinnavarrete.dev` to ensure both URLs work smoothly.

---

## 💻 Local Testing & Preview
To preview the website locally anytime:
```bash
python3 -m http.server 8080 --directory "/home/martin/Documents/Repos/martinnavarrete.dev"
```
Then open `http://localhost:8080` in your web browser.
