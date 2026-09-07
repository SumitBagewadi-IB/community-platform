# Indiabulls Securities Community Theme

A [Discourse](https://discourse.org) theme that brings the Indiabulls
Securities community platform in line with the visual identity of
[indiabullssecurities.com](https://www.indiabullssecurities.com) — brand
colors, typography, logo, and a regulatory-disclaimer footer.

## What's here

This repo *is* a Discourse theme (not a Discourse install). It follows
Discourse's standard theme structure:

| Path | Purpose |
|---|---|
| `about.json` | Theme metadata + the `Indiabulls Securities` light/dark color schemes |
| `settings.yml` / `locales/en.yml` | Admin-configurable footer text/toggle |
| `common/common.scss` | Design tokens (colors, fonts, radii) and component overrides |
| `common/head_tag.html` | Loads the Manrope/Poppins webfonts |
| `common/footer.html` | Branded footer with regulatory disclaimer block |
| `desktop/`, `mobile/` | Breakpoint-specific tweaks |
| `assets/images/` | Logo files pulled from indiabullssecurities.com's asset CDN |

## Design tokens

- **Brand green** `#00AB4E` — taken directly from the fill color inside the
  official logo SVG.
- Supporting greens: `#11A971`, `#00C076`, `#18874A`.
- **Headings**: Poppins · **Body**: Manrope — the two most-used families on
  the live site, loaded via Google Fonts in `common/head_tag.html`.
- **Corner radius scale**: 0.5rem / 0.75rem / 1rem / 1.5rem, matching the
  rounded buttons/cards on the corporate site.

## Installing into a Discourse instance

1. In Discourse admin: **Customize → Themes → Install → From a git
   repository**, and point it at this repo's URL.
2. Set it as the site's default theme, and (optionally) set
   **Indiabulls Securities Dark** as the site's dark-mode color scheme.
3. In **Customize → Themes → Indiabulls Securities Community Theme →
   Settings**, replace `footer_disclaimer_text` with the current
   compliance-approved SEBI disclaimer and registration numbers — the
   shipped value is a placeholder and must not be used as-is in
   production.

## Status / next steps

- No Discourse instance is running yet in this environment (no local
  Docker available). The theme has been authored against Discourse's
  documented theme APIs but has **not yet been visually verified** in a
  running Discourse instance.
- Once a Discourse instance (local or hosted trial) is available, use the
  [`discourse_theme` CLI](https://meta.discourse.org/t/developing-a-discourse-theme-locally-using-discourse-theme-cli/25218)
  (`gem install discourse_theme`, then `discourse_theme watch .`) to live-sync
  this folder into it for fast visual iteration.
- Out of scope for this pass: Discourse plugins, SSO/auth integration,
  category/permission structure, and moderation setup.
