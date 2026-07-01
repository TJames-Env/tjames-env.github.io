# eusebio@it-sec

> **BUILD. AUTOMATE. EXPLOIT.**

Personal portfolio and browser-based tool suite — built by an M365 & Power Platform engineer, agentic-AI builder, and offensive-security practitioner based in Toronto.

**Live site:** https://tjames-env.github.io/

---

## About

A static, zero-backend portfolio that doubles as a working tool suite. It pairs a profile homepage with self-contained security and automation utilities and a set of technical write-ups. Every page is a single HTML file that runs directly in the browser — no framework, no bundler, no server.

The site reflects two halves of the same practice: building and automating on the Microsoft cloud (Power Automate, Copilot Studio, SharePoint, Office Scripts), and pressure-testing those same systems from a security angle.

## How it's built

The whole site is deliberately **dependency-light and self-contained**. Each page ships its own CSS and JavaScript inline, so any file can be opened, copied, or audited on its own.

**Architecture**
- Static HTML/CSS/JS, **no build step** — what's in the repo is what ships.
- Each tool is a single file and **runs entirely client-side**; nothing is uploaded or sent to a server.
- One shared visual language reused across ~14 pages, with per-page theming.

**Design system**
- Dark palette built on CSS custom properties (design tokens) for color, surfaces, borders, and text.
- **Per-tool accent colors** (e.g. cyan, teal, lime, blue, violet, pink) so each utility has its own identity while staying consistent.
- Type system: **Syne** (display), **JetBrains Mono** (mono/labels), **Outfit** (body).

**Interactive 3D backgrounds**
- **Three.js (r128)** drives the homepage neural-mesh hero and calm drifting-point fields behind the tools.
- Cursor parallax, accent-tinted particles, and a `prefers-reduced-motion` fallback that disables animation.

**Responsive & accessible**
- Mobile-first reflow with shrink-safe CSS grids (`minmax(0, …)`), components that **wrap or stack** instead of overflowing, and breakpoints tuned per layout.
- Keyboard-operable controls, `:focus-visible` states, reduced-motion support, and real text (no baked-in-image text) for localization and screen readers.

**Print-ready reporting**
- Report tools generate clean, paginated documents with framework mappings (**MITRE ATT&CK, OWASP LLM, CIS, NIST**), letter-grade scoring, and **Markdown export**.
- Print styles force a white background and **detach the WebGL canvas** before printing so reports never render with a black artifact.

**Feedback & UX**
- A consistent, non-blocking feedback layer: toast notifications, "working…" spinner states on long actions, and scroll-to-result — with no blocking `alert()`/`confirm()` dialogs.

**Privacy-first**
- The utilities are safe to use with real data: everything is processed in-browser, and each tool surfaces a **"Local-only"** indicator to make that explicit.

## What's used

| Area | Choice |
|------|--------|
| Markup / styling / logic | Vanilla HTML, CSS, JavaScript (no framework) |
| 3D / motion | Three.js r128 |
| Typography | Syne · JetBrains Mono · Outfit (Google Fonts) |
| Styling approach | CSS custom properties (design tokens), CSS Grid + Flexbox |
| Hosting | GitHub Pages |
| Tooling | None required — no Node, no build pipeline |

## Tools

Each tool is a single HTML file and runs **entirely client-side**.

| Tool | File | Purpose |
|------|------|---------|
| DFIR Report Generator | `dfir-tool.html` | Incident reports mapped to MITRE ATT&CK and NIST SP 800-61r2, with Markdown export. |
| Copilot Studio Auditor | `copilot-auditor.html` | Reviews a Copilot Studio agent export against OWASP LLM risks; letter-grade scoring. |
| Power Automate Flow Analyzer | `flow-analyzer.html` | Analyzes a flow definition for security and governance issues; letter-grade scoring. |
| M365 Hardening Checklist | `m365-checklist.html` | CIS-aligned Microsoft 365 checklist with live scoring and a printable report. |
| Conditional Access Advisor | `ca-policy-advisor.html` | Build, simulate, and gap-check Entra ID Conditional Access policies. |
| Power Automate Reference | `pa-dev-cs.html` | Searchable expression/pattern cheat sheet with copyable, variable-substituted snippets. |
| Power Apps Reference | `powerapps-cs.html` | Power Apps formula reference (same engine as above). |
| Copilot Studio Guide | `copilot-cs.html` | Copilot Studio builder reference and topics. |

## Write-ups

- **Top 5 M365 Misconfigurations I've Seen in Enterprise Environments** — `top-5-m365-misconfig.html`
- **How I Passed the CLLMSP** — `CLLMSP.html`
- **SMB Relay Attack** — `SMB-Relay.html`
- **Building a Copilot Studio HR Agent from Scratch** — `copilot-studio-from-scratch.html`
- **Entra ID Conditional Access — The Gaps Attackers Look For** — `entra-id-ca.html`

## Project structure

```
.
├── index.html                       # Homepage (3D hero, profile, timeline)
├── projects.html                    # Projects + write-ups hub
│
├── dfir-tool.html                   # DFIR report generator
├── copilot-auditor.html             # Copilot Studio auditor
├── flow-analyzer.html               # Power Automate flow analyzer
├── m365-checklist.html              # M365 hardening checklist
├── ca-policy-advisor.html           # Conditional Access advisor
├── pa-dev-cs.html                   # Power Automate reference
├── powerapps-cs.html                # Power Apps reference
├── copilot-cs.html                  # Copilot Studio guide
│
├── top-5-m365-misconfig.html        # Write-up
├── CLLMSP.html                      # Write-up
├── copilot-studio-from-scratch.html # Write-up
├── SMB-Relay.html                   # Write-up
└── entra-id-ca.html                 # Write-up
```

## Running locally

No dependencies. Open `index.html` directly, or serve the folder so internal links resolve cleanly:

```bash
git clone https://github.com/TJames-Env/tjames-env.github.io.git
cd tjames-env.github.io

# Option A — open directly
open index.html        # macOS  (use "start" on Windows, "xdg-open" on Linux)

# Option B — local web server (recommended)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Build approach

Built iteratively and test-driven — each page validated against real device widths and print output, with recurring fixes (responsive overflow, print artifacts, accessible feedback) standardized across the suite. Development used an **agentic, AI-assisted workflow**, fitting for a site about building and automating with AI.

## Connect

- **Site:** https://tjames-env.github.io/
- **GitHub:** https://github.com/TJames-Env
- **Medium:** https://medium.com/@timothy_jameseusebio
- **Location:** Toronto, ON · open to remote

## License

© eusebio@it-sec. All rights reserved.

This is a personal portfolio; the source is not licensed for reuse. Third-party assets it loads (Three.js, Google Fonts) remain under their own open-source licenses.
