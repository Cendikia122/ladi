# Redesign Plan: Ladi — Linear Late-2024 Product Page

## Brief & Direction
- **Identity**: Ladi (Digital Presence Engineering)
- **Core Proposition**: "Bisnis Anda hidup di internet global." Elevating from low-end local map pin services to institutional-grade digital presence architecture.
- **Aesthetic**: Linear late-2024 product page.
  - Strong, architectural sans-serif headings (Plus Jakarta Sans, no Inter/Roboto/Open Sans).
  - Generous negative space throughout.
  - Thin 1px separators and hairline borders (`border-white/[0.08]`).
  - Monochromatic dark palette (`#08090a`), almost no color until the CTA.
  - Hard 1px borders only — zero soft drop shadows.
  - Zero purple-to-indigo gradients.
  - Zero three-up feature cards on white.
  - Zero testimonial cards (replaced with empty space).
  - Zero emojis across the entire surface.
  - Zero third-party icon libraries (bespoke inline SVGs only).

## Pre-emit verification
<design_plan>
macrostructure_diversification: Workbench
vibe_validity: Minimal / Linear late-2024
dial_alignment: bg=#08090a, surface=#0d0e12, border=rgba(255,255,255,0.08), ink=#f4f4f5, accent=#ffffff
motion_personality: Restraint (0-1/3 minimal, CSS transitions only)
hero_math: pt-40 pb-28, max-w-4xl, H1 2 lines max, strong sans-serif, high negative space
bento_density: Spacious negative space over card density, thin 1px dividers
label_sweep: Clean functional labels, no meta-labels (SECTION 01 / CHAPTER)
button_contrast: Pure stark contrast (solid white on obsidian background)
honest_copy: Zero fake testimonials, zero fake metrics, authoritative institutional copy for global digital presence
gsap_decision: None (CSS only, zero bloat)
</design_plan>

## Execution Steps
1. Update `app/globals.css` with Linear design tokens, hard 1px borders, zero shadows, zero purple gradients.
2. Update `app/layout.tsx` to remove Inter and set up Plus Jakarta Sans + JetBrains Mono.
3. Overhaul `app/components/Navbar.tsx` to match Linear late-2024 navigation.
4. Overhaul `app/components/Hero.tsx` with generous negative space, strong sans-serif title, no gradient hero background, and an authoritative global index workbench.
5. Overhaul `app/components/Stats.tsx` into a thin 1px hairline border metrics band.
6. Overhaul `app/components/Services.tsx` into an editorial Capabilities architecture.
7. Overhaul `app/components/HowItWorks.tsx` into a disciplined execution protocol.
8. Overhaul `app/components/AuditSection.tsx` into a 10-point technical readiness evaluation matrix.
9. Overhaul `app/components/WhyLadi.tsx` into a clean comparative distinction table.
10. Remove `Testimonials.tsx` from `app/page.tsx` (replace with empty space).
11. Overhaul `app/components/FAQ.tsx` with minimalist 1px border accordions.
12. Overhaul `app/components/FinalCTA.tsx` with stark contrast and generous whitespace.
13. Overhaul `app/components/Footer.tsx` and `app/components/WhatsAppButton.tsx`.
14. Audit against all forbidden rules: no Inter, no purple gradients, no 3-up cards, no soft shadows, no emojis, no "transform your workflow".
