# eusebio@it-sec

> **BUILD. AUTOMATE. EXPLOIT.**

Personal portfolio and browser-based tool suite — built by an M365 & Power Platform engineer, agentic-AI builder, and offensive-security practitioner.

**Live site:** https://tjames-env.github.io/

---

## About

A static, zero-backend portfolio that doubles as a working tool suite. It pairs a profile homepage with self-contained security and automation utilities, quick-reference cheatsheets, pentest work, and a set of technical write-ups. Every page is a single HTML file that runs directly in the browser — no framework, no bundler, no server.

The site reflects two halves of the same practice: building and automating on the Microsoft cloud (Power Automate, Copilot Studio, SharePoint, Office Scripts), and pressure-testing those same systems from a security angle.

## How it's built

The whole site is deliberately **dependency-light and self-contained**. Each page ships its own CSS and JavaScript inline, so any file can be opened, copied, or audited on its own.

**Architecture**
- Static HTML/CSS/JS, **no build step** — what's in the repo is what ships.
- Each tool is a single file and **runs entirely client-side**; nothing is uploaded or sent to a server.
- One shared visual language reused across every page (2 core pages, 7 tools, 5 cheatsheets, and the write-ups), with per-page theming.

**Design system**
- Dark palette built on CSS custom properties (design tokens) for color, surfaces, borders, and text.
- **Per-tool accent colors** (e.g. cyan, teal, lime, blue, violet, pink) so each utility has its own identity while staying consistent.
- Type system: **Syne** (display), **JetBrains Mono** (mono/labels), **Outfit** (body).

**Interactive 3D backgrounds**
- **Three.js (r128)** drives the homepage neural-mesh hero and calm drifting-point fields behind the tools.
- Cursor parallax, accent-tinted particles, and a `prefers-reduced-motion` fallback that disables animation.

**Responsive & accessible**
- Mobile-first reflow with shrink-safe CSS grids (`minmax(0, …)`), components that **wrap or stack** instead of overflowing, a hamburger nav on small screens, and breakpoints tuned per layout.
- Keyboard-operable controls, `:focus-visible` states, reduced-motion support, and real text (no baked-in-image text) for localization and screen readers.

**Print-ready reporting**
- Report tools generate clean, paginated documents with framework mappings (**MITRE ATT&CK, OWASP, CWE, CIS, NIST**), CVSS / letter-grade scoring, and **Markdown export**.
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
| DFIR Report Generator | `dfir-tool.html` | M365 / Entra ID incident-response report builder — structured reports mapped to MITRE ATT&CK & NIST SP 800-61r2, with Markdown export. |
| Pentest Report Builder | `pentest-report.html` | Pentest report generator with CVSS v3.1 scoring, OWASP + CWE mapping, a remediation table, and a table of contents. |
| M365 Misconfiguration Checklist | `m365-checklist.html` | 57 enterprise security checks across Identity, Exchange, SharePoint, Teams, Power Platform, Defender, Endpoint & Audit — with PowerShell remediation and scoring. |
| Power Automate Flow Analyzer | `flow-analyzer.html` | Paste a flow's JSON to scan for hardcoded secrets, risky connectors, HTTP/DLP risks, error-handling gaps, and data-exfil patterns; letter-grade scoring. |
| Copilot Studio Agent Auditor | `copilot-auditor.html` | Audits Copilot Studio agents for overprivileged connections, exposed topics, unvalidated inputs, and missing auth — mapped to OWASP LLM risks. |
| AD Attack Path Visualiser | `ad-visualiser.html` | Interactive Active Directory attack-path visualisation from BloodHound JSON — low-priv user to Domain Admin with the exploited edges. |
| CA Policy Advisor | `ca-policy-advisor.html` | Build, simulate, and gap-check Entra ID Conditional Access policies — visual builder, sign-in simulator, and gap analysis. |

## Cheatsheets

Searchable, copy-ready references — each with live variable substitution.

| Cheatsheet | File | Focus |
|------------|------|-------|
| Recon & Enumeration Arsenal | `recon-arsenal.html` | 112 techniques across 15 categories — Network, SMB, LDAP, DNS, Web, ADCS, Cloud, K8s, OSINT and more. |
| Pentest Methodology Cheatsheet | `pentest-cs.html` | OWASP phases, web/network/AD attack vectors, a CVSS scoring guide, scope definitions, and tool selection. |
| Power Automate Dev Reference | `pa-dev-cs.html` | Expressions, `formatDateTime`, JSON parsing, HTTP patterns, try/catch error handling, and approval flows. |
| Power Apps Developer Reference | `powerapps-cs.html` | Canvas-app formulas, delegation rules, component patterns, data-source connections, and performance best practices. |
| Copilot Studio Builder Guide | `copilot-cs.html` | Topics, entities, OData filters, Adaptive Card JSON, Power Fx, debugging, autonomous agents, and human handoff. |

## Pentest work

| Report | Status |
|--------|--------|
| Internal Network Pentest Report (sample) | Live — [repo](https://github.com/TJames-Env/internal-pentest-report-sample) |
| Web Application Assessment Report | Coming soon |
| TryHackMe Lab Write-ups | Coming soon |

## Write-ups

Long-form articles — hosted here and distributed on Medium.

- **How I Passed the eJPT — Study Path, Labs & Lessons** — on Medium
- **Top 5 M365 Misconfigurations I've Seen in Enterprise Environments** — `top-5-m365-misconfig.html`
- **How I Passed the CLLMSP — LLM Security for Enterprise Practitioners** — `CLLMSP.html`
- **SMB Relay Attack — Lab Walkthrough & Detection** — `smb-relay.html`
- **Building a Copilot Studio HR Agent from Scratch** — `copilot-studio-from-scratch.html`
- **Entra ID Conditional Access — The Gaps Attackers Look For** — `entra-id-ca.html`

## Project structure

```
.
├── index.html                       # Homepage (3D hero, profile, timeline)
├── projects.html                    # Projects, cheatsheets, pentest & write-ups hub
│
│   # Tools
├── dfir-tool.html                   # DFIR report generator
├── pentest-report.html              # Pentest report builder
├── m365-checklist.html              # M365 misconfiguration checklist
├── flow-analyzer.html               # Power Automate flow analyzer
├── copilot-auditor.html             # Copilot Studio agent auditor
├── ad-visualiser.html               # AD attack-path visualiser
├── ca-policy-advisor.html           # Conditional Access advisor
│
│   # Cheatsheets
├── recon-arsenal.html               # Recon & enumeration arsenal
├── pentest-cs.html                  # Pentest methodology cheatsheet
├── pa-dev-cs.html                   # Power Automate dev reference
├── powerapps-cs.html                # Power Apps developer reference
├── copilot-cs.html                  # Copilot Studio builder guide
│
│   # Write-ups
├── top-5-m365-misconfig.html
├── CLLMSP.html
├── smb-relay.html
├── copilot-studio-from-scratch.html
└── entra-id-ca.html                 # (eJPT write-up is on Medium)
```

## Build approach

Built iteratively and test-driven — each page validated against real device widths and print output, with recurring fixes (responsive overflow, print artifacts, accessible feedback) standardized across the suite.

## Connect

- **Site:** https://tjames-env.github.io/
- **GitHub:** https://github.com/TJames-Env
- **Medium:** https://medium.com/@timothy_jameseusebio
- **Location:** Toronto, ON · open to remote

## License

© eusebio@it-sec. All rights reserved.

This is a personal portfolio; the source is not licensed for reuse. Third-party assets it loads (Three.js, Google Fonts) remain under their own open-source licenses.
