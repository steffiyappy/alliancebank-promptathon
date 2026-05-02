# Alliance Bank Malaysia × Microsoft 365 Copilot Prompt-a-thon 2025

A GitHub Pages site hosting the game packs for Alliance Bank's internal Microsoft 365 Copilot Prompt-a-thon event.

## Structure

- `index.html` — Landing page with all 8 team cards
- `company.html` — Alliance Bank company brief (read before playing)
- `teams/` — Individual team pack pages (password-locked)
- `assets/` — Shared CSS and JavaScript

## Team Codes

Each team receives their code from the Game Master:

| Team | Department | Code |
|------|-----------|------|
| 1 | Consumer Banking | `ABMB-CB` |
| 2 | SME Banking | `ABMB-SME` |
| 3 | HR & Talent | `ABMB-HR` |
| 4 | Finance & Reporting | `ABMB-FIN` |
| 5 | Risk & Compliance | `ABMB-RC` |
| 6 | Digital Banking & Technology | `ABMB-DIGI` |
| 7 | Corporate Communications | `ABMB-COMMS` |
| 8 | Strategy & Transformation | `ABMB-STRAT` |

## How the Lock Works

- Each team page is locked with a JavaScript-based code gate
- Correct code is required to see the pack content
- Power Ups are revealed only after teams click "We've Completed Our Work"
- State is stored in `localStorage` (per browser)

## Deployment

Hosted on GitHub Pages. Access at: `https://[username].github.io/alliancebank-promptathon/`
