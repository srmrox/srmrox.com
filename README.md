# srmrox.com

Personal projects site for Shahrukh Malik. Plain HTML + CSS. No build step.
Theme matches shahrukhmalik.com (dark "Cactus" look, JetBrains Mono, green accent #2bbc8a, pink hover #d480aa).

## Files

| File | What it is |
|---|---|
| index.html | Home: intro, social links, topics, featured projects, log |
| projects.html | All projects, grouped by status (active, paused, archived) |
| about.html | Bio, links, uses |
| 404.html | Not-found page |
| css/style.css | All styles. Colors are variables at the top. |
| css/crt.css | Old CRT monitor filter (scanlines, dark corners, text glow, flicker) |
| js/crt.js | "CRT: on/off" button in the footer. Saves the choice in the browser. |
| images/logo.svg | Placeholder logo |
| CNAME | Custom domain for GitHub Pages |

## Preview

Open index.html in a browser. Or run a local server in this folder:

    python -m http.server 8000

Then go to http://localhost:8000

## Add a project

Copy one `<li class="project-item">` block in projects.html and edit it.
Status class: `active`, `paused`, `shipped` or `archived`.
Add it to the "Featured" list on index.html too, if you want it on the home page.

## Add a log entry

Copy one `<li class="post-item">` line in the "Log" list on index.html. Newest first.

## CRT filter

The pages look like an old CRT monitor: scanlines, dark corners, a green glow on text and a faint flicker.
It is pure CSS in css/crt.css and is active only while `<html>` has the class `crt`.

- Visitors turn it on or off with the "CRT: on/off" button in the footer. Their choice is saved in the browser.
- Off by default: remove `class="crt"` from the `<html>` tag in all 4 pages. The button still turns it on.
- Remove it fully: delete the crt.css and crt.js lines in `<head>` and the `crt-toggle` button in the footer of each page.
- Tune it: change the variables at the top of css/crt.css. Set one to 0 to switch that part off.

| Variable | What it does |
|---|---|
| `--crt-scanline-opacity` | Darkness of the scanlines |
| `--crt-scanline-size` | Height of one scanline pair |
| `--crt-vignette` | Darkness of the screen corners |
| `--crt-glow` | Strength of the green text glow |
| `--crt-fringe` | Red/cyan colour fringe offset on text |
| `--crt-flicker` | Strength of the flicker |

The flicker stops for visitors who set "reduce motion" on their device. The filter is off in print.

## Deploy (GitHub Pages)

1. Push to github.com/srmrox/srmrox.com (branch `main`).
2. Repo Settings > Pages > Source: "Deploy from a branch", `main`, `/ (root)`.
3. DNS for srmrox.com: A records to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, and CNAME `www` to `srmrox.github.io`.
4. Tick "Enforce HTTPS" once the certificate is issued.

Any static host works too (Cloudflare Pages, Netlify, Hostinger): upload the folder as-is.
