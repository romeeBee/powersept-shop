# SIGNAL — design guide

Editorial tech magazine. Ink on warm paper, one hot accent, generous whitespace.
Every decision below lives as a token in `src/index.css`; change it there, not inline.

## Type

| Role | Family | Token | Usage |
| --- | --- | --- | --- |
| Display | Instrument Serif | `--font-display` | h1–h4, lead headlines, drop cap |
| Text | Inter | `--font-sans` | body, UI, nav |
| Mono | JetBrains Mono | `--font-mono` | kickers, metadata, code, counters |

Kickers and metadata are mono, uppercase, `tracking-[0.18em]`, 11px.
Headlines use `tracking-[-0.025em]` and `text-balance`.

## Color

| Token | Light | Role |
| --- | --- | --- |
| `--background` | warm paper `oklch(0.985 0.004 85)` | page |
| `--foreground` | ink `oklch(0.17 0.012 70)` | text |
| `--primary` | vermilion `oklch(0.585 0.205 32)` | accent, links on hover, rules |
| `--muted-foreground` | `oklch(0.52 0.012 75)` | metadata only |
| `--border` | `oklch(0.9 0.006 80)` | hairlines |
| `--ink-band` | near-black `oklch(0.175 0.014 70)` | inverted sections |

Dark mode flips paper to `oklch(0.155 0.009 70)` and lifts the accent to
`oklch(0.68 0.18 36)` so it stays legible.

Accent is for emphasis, never for large fills. Topic colors come from
`--topic-1…5` and are used as 2px rules and small dots, not backgrounds.

## Layout

- Page container: `container-page`, max `1240px`, 24/32px gutters.
- Article measure: `max-w-[68ch]`.
- Section rhythm: `py-20` desktop / `py-14` mobile. Whitespace separates
  sections; a hairline only where a grid genuinely needs a column edge.
- Grid: 12 columns desktop, 6 tablet, 1 mobile.

## Components

- **Cover art** is generative (`<CoverArt/>`), seeded from the article slug.
  No stock photography.
- **Cards** are borderless by default: image, kicker, headline, byline.
  Hairlines appear only as grid dividers.
- **Buttons**: 1–3 words, verb first, `rounded-full`, 13px mono uppercase.
- **Reading progress** is a 2px accent bar pinned under the header on articles.

## Rules

- No em dashes or en dashes in user-visible copy.
- One line of text per element. No grey subtitle restating a heading.
- Max one muted helper line per section, ≤12 words.
