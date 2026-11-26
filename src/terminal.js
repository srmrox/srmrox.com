// srmrox.com terminal. WebGL CRT screen with a small shell.
// CRT renderer: cool-retro-term-renderer by Remo H. Jansen (GPL-3.0).
// This file is GPL-3.0 too. Build: npm run build  ->  js/terminal.bundle.js
import { CRTTerminal } from "cool-retro-term-renderer";
import { Terminal } from "@xterm/xterm";

const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const touch = matchMedia("(pointer: coarse)").matches;

// ---------- Site data: read from the HTML pages, so there is one source ----------
const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
async function loadDoc(url) {
  try {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw 0;
    return new DOMParser().parseFromString(await r.text(), "text/html");
  } catch (e) { return null; }
}
function readProjects(doc) {
  return [...doc.querySelectorAll(".project-item")].map((li) => {
    const a = li.querySelector("a");
    return {
      name: clean(a && a.textContent),
      url: a ? a.getAttribute("href") : "#",
      status: clean(li.querySelector(".status") && li.querySelector(".status").textContent),
      desc: clean(li.querySelector(".desc") && li.querySelector(".desc").textContent),
      tags: clean(li.querySelector(".tags") && li.querySelector(".tags").textContent),
    };
  });
}
const data = { intro: "", projects: [], about: [], log: [], links: [] };
function readHome(doc) {
  const intro = doc.querySelector("#about p");
  data.intro = clean(intro && intro.textContent);
  data.links = [...doc.querySelectorAll(".social a")].map((a) => ({
    name: a.getAttribute("aria-label"), url: a.getAttribute("href"),
  }));
  data.log = [...doc.querySelectorAll("#log .post-item")].map((li) => ({
    date: clean(li.querySelector("time").textContent),
    text: clean(li.querySelector("span").textContent),
  }));
  if (!data.projects.length) data.projects = readProjects(doc);
}
async function loadData() {
  readHome(document);
  const [p, a] = await Promise.all([loadDoc("projects.html"), loadDoc("about.html")]);
  if (p) { const list = readProjects(p); if (list.length) data.projects = list; }
  if (a) data.about = [...a.querySelectorAll("main > p")].map((x) => clean(x.textContent));
  if (!data.about.length) data.about = [data.intro];
}

// ---------- Screen ----------
const container = document.getElementById("term");
const crt = new CRTTerminal({
  container,
  fontColor: "#2bbc8a",          // same green as the plain site
  screenCurvature: 0.3,
  bloom: 0.55,
  rgbShift: 0.002,
  flickering: reduced ? 0 : 0.1,
  horizontalSync: reduced ? 0 : 0.08,
  jitter: reduced ? 0 : 0.12,
  staticNoise: reduced ? 0.04 : 0.12,
  glowingLine: reduced ? 0 : 0.2,
  burnIn: 0.25,
});

const term = new Terminal({ cols: 80, rows: 24, scrollback: 1000, convertEol: true });
const hidden = document.createElement("div");
hidden.className = "xterm-hidden";
document.body.appendChild(hidden);
term.open(hidden);
crt.attachXTerm(term);

// Tap or click the screen to type (opens the keyboard on phones).
container.addEventListener("click", () => crt.focus());
container.addEventListener("touchend", () => crt.focus());

// ---------- Output helpers ----------
const W = () => Math.max(20, term.cols - 1);
function wrap(text, indent = "") {
  const out = []; let line = indent;
  for (const word of text.split(" ")) {
    if ((line + word).length > W() && line.trim()) { out.push(line.replace(/\s+$/, "")); line = indent; }
    line += word + " ";
  }
  out.push(line.replace(/\s+$/, ""));
  return out.join("\n");
}
const say = (s = "") => term.write(s + "\n");
const pad = (s, n) => (s + " ".repeat(n)).slice(0, Math.max(n, s.length));
const PROMPT = "guest@srmrox:~$ ";

// ---------- Commands ----------
const FILES = { "about.txt": "about", "projects.txt": "projects", "contact.txt": "contact", "log.txt": "log" };
const commands = {
  help: () => {
    say("Commands:");
    [["about", "who I am"], ["projects", "list my projects"], ["open <n>", "open project number n"],
     ["contact", "where to find me"], ["log", "recent updates"], ["ls / cat <file>", "browse files"],
     ["clear", "clear the screen"], ["gui", "switch to the plain website"]]
      .forEach(([c, d]) => say(term.cols >= 40 ? "  " + pad(c, 16) + d : "  " + c + "\n" + wrap(d, "    ")));
    if (touch) { say(); say(wrap("Tip: tap the buttons below, or tap the screen to type.")); }
  },
  about: () => { data.about.forEach((p) => say(wrap(p)) || say()); },
  whoami: () => say("guest. Shahrukh is the one who built this. Try 'about'."),
  projects: () => {
    data.projects.forEach((p, i) => {
      say(`[${i + 1}] ${p.name}${p.status ? "  (" + p.status + ")" : ""}`);
      if (p.desc) say(wrap(p.desc, "    "));
    });
    say(); say(wrap("Type 'open <number>' to visit one."));
  },
  open: (arg) => {
    const n = parseInt(arg, 10);
    const p = n ? data.projects[n - 1] : data.projects.find((x) => x.name.toLowerCase() === (arg || "").toLowerCase());
    if (!p || !p.url || p.url === "#") return say("No such project. Type 'projects' to see the list.");
    say("Opening " + p.url + " ...");
    window.open(p.url, "_blank", "noopener");
  },
  contact: () => {
    data.links.forEach((l) => say("  " + pad(l.name, 10) + l.url.replace(/^mailto:/, "")));
    say("  " + pad("Writing", 10) + "https://shahrukhmalik.com/");
  },
  log: () => data.log.forEach((l) => say(wrap(l.date + "  " + l.text))),
  ls: () => say(Object.keys(FILES).join("   ")),
  cat: (arg) => (FILES[arg] ? commands[FILES[arg]]() : say(`cat: ${arg || ""}: No such file`)),
  clear: () => term.clear(),
  date: () => say(new Date().toString()),
  echo: (arg) => say(arg || ""),
  sudo: () => say("Nice try."),
  gui: () => {
    try { localStorage.setItem("term", "off"); } catch (e) {}
    location.reload();
  },
};
commands.exit = commands.gui;
commands.contacts = commands.contact;

function run(line) {
  const [cmd, ...rest] = line.trim().split(/\s+/);
  if (!cmd) return;
  const fn = commands[cmd.toLowerCase()];
  if (fn) fn(rest.join(" "));
  else say(`${cmd}: command not found. Type 'help'.`);
}

// ---------- Line editor ----------
let buf = "", hist = [], hi = 0, busy = true;
function prompt() { term.write("\n" + PROMPT); buf = ""; busy = false; }
function replaceLine(s) { term.write("\b \b".repeat(buf.length)); buf = s; term.write(s); }
function submit(line) {
  busy = true; term.write("\n");
  if (line.trim()) { hist.push(line); hi = hist.length; }
  run(line); prompt();
}
term.onData((d) => {
  if (busy) return;
  if (d === "\r") return submit(buf);
  if (d === "\x7f" || d === "\b") { if (buf) { buf = buf.slice(0, -1); term.write("\b \b"); } return; }
  if (d === "\x03") { term.write("^C"); return prompt(); }
  if (d === "\x0c") { term.clear(); return; }
  if (d === "\x1b[A") { if (hi > 0) replaceLine(hist[--hi]); return; }
  if (d === "\x1b[B") { hi = Math.min(hist.length, hi + 1); replaceLine(hist[hi] || ""); return; }
  if (d === "\t") {
    const words = Object.keys(commands).concat(Object.keys(FILES));
    const last = buf.split(" ").pop();
    const m = words.filter((w) => last && w.startsWith(last));
    if (m.length === 1) { const add = m[0].slice(last.length) + " "; buf += add; term.write(add); }
    return;
  }
  if (d.startsWith("\x1b")) return;
  const clean = d.replace(/[\x00-\x1f]/g, "");
  buf += clean; term.write(clean);
});

// Type a command as if the visitor typed it (used by boot and the touch buttons).
async function typeCmd(cmd) {
  if (busy) return;
  busy = true;
  replaceLine("");
  for (const ch of cmd) { buf += ch; term.write(ch); if (!reduced) await sleep(45); }
  submit(buf);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Touch buttons
const bar = document.getElementById("term-bar");
if (bar) bar.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-cmd]");
  if (b) typeCmd(b.dataset.cmd);
});

// ---------- Boot ----------
const BANNER = [
  "  ___ _ __ _ __ ___  _ __ _____  __",
  " / __| '__| '_ ` _ \\| '__/ _ \\ \\/ /",
  " \\__ \\ |  | | | | | | | | (_) >  < ",
  " |___/_|  |_| |_| |_|_|  \\___/_/\\_\\",
];
(async () => {
  await loadData();
  const boot = ["SRMROX BIOS v1.0", "Memory test ... OK", "Loading projects ... " + data.projects.length + " found", ""];
  for (const l of boot) { say(wrap(l)); if (!reduced) await sleep(180); }
  if (term.cols >= 38) BANNER.forEach((l) => say(l)); else say("srmrox");
  say();
  say(wrap(data.intro || "Welcome."));
  say(wrap("Type 'help' to see what you can do."));
  busy = false; buf = "";
  term.write("\n" + PROMPT);
  if (!touch) crt.focus();
  root.classList.add("term-ready");
})();
