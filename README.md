# srmrox.com

Personal projects site for Shahrukh Malik. Plain HTML + CSS, plus a WebGL CRT terminal on the home page.
The terminal JS is already built (js/terminal.bundle.js), so hosting needs no build step.
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
| js/boot.js | Picks terminal or plain site before the page paints. Shows the "Terminal" footer button. |
| css/terminal.css | Full-screen terminal layout and the touch buttons |
| src/terminal.js | Terminal source: commands, boot text, CRT settings |
| js/terminal.bundle.js | Built from src/terminal.js. Do not edit by hand. |
| package.json | Build tools for the terminal (only needed when you change src/terminal.js) |
| LICENSE | GPL-3.0 |
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

## WebGL CRT terminal (home page)

index.html opens as a retro CRT terminal, like remojansen.com. It uses
[cool-retro-term-renderer](https://github.com/remojansen/cool-retro-term-webgl) by Remo H. Jansen
(three.js + xterm.js), which is GPL-3.0. So this site's code is GPL-3.0 too (see LICENSE).

- The terminal reads your projects from projects.html and your intro, links and log from index.html,
  and the bio from about.html. Edit the HTML; the terminal follows. (This needs a web server.
  Opened as a plain file, it uses only what is on index.html.)
- Commands: help, about, projects, open <n>, contact, log, ls, cat <file>, clear, gui/exit.
- Phones get a row of command buttons. Tap the screen to open the keyboard.
- Fallback: no WebGL, a script error, or a visitor typing `gui` shows the plain site
  (with the CSS CRT filter). The footer "Terminal" button goes back to the terminal.
  Add `?plain` to the URL to force the plain site.
- Reduced motion: flicker, jitter, sync and scan beam are switched off.
- The bundle is about 2.2 MB (about 0.9 MB gzipped). It loads only when the terminal is used.

### Change the terminal

1. Install Node.js, then in this folder run: `npm install`
2. Edit src/terminal.js (commands, boot text, colours and CRT settings near the top).
3. Run: `npm run build`
4. Commit js/terminal.bundle.js with your change.

## Deploy (GitHub Pages)

1. Push to github.com/srmrox/srmrox.com (branch `main`).
2. Repo Settings > Pages > Source: "Deploy from a branch", `main`, `/ (root)`.
3. DNS for srmrox.com: A records to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, and CNAME `www` to `srmrox.github.io`.
4. Tick "Enforce HTTPS" once the certificate is issued.

Any static host works too (Cloudflare Pages, Netlify, Hostinger): upload the folder as-is.
