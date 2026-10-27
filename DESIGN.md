# SIGNAL — design guide

Decisions recorded here are implemented through tokens in `src/index.css`. Change the token,
not the component.

## Colour

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--background` / `bg-background` | paper white `oklch(0.982 0.004 85)` | ink `oklch(0.155 0.008 60)` | page surface |
| `--foreground` | ink `oklch(0.175 0.012 60)` | paper | body text |
| `--signal` / `text-signal` | vermilion `oklch(0.56 0.205 29)` | `oklch(0.66 0.2 32)` | the only accent: kickers, links on hover, active nav, primary buttons |
| `--rule` / `border-rule` | `oklch(0.875 0.008 80)` | `oklch(1 0 0 / 13%)` | every hairline |
| `--ink` / `--paper` | fixed ink/paper pair | inverted | the dark band on the front page |

One accent only. Topic colour lives in generated cover art (`hue` on each category), never in UI chrome.

## Type

- **Display** `Instrument Serif` — headlines, wordmark, stat numbers. Weight 400 only, tracking `-0.015em`.
- **Sans** `Inter` — UI, bylines, navigation, admin.
- **Reading serif** `Source Serif 4` — article body (`.reading`, 1.1875rem / 1.75).
- **Mono** `JetBrains Mono` — kickers, meta labels, slugs (`.kicker`, 0.6875rem, tracking `0.18em`, uppercase).

Headline sizes use `clamp()` so the front page and article headers scale with the viewport.

## Layout

- `container-page` — max width `88rem`, padding `1.25rem → 3rem`.
- `container-read` — `44rem`, article measure.
- Separation is whitespace first. Hairlines only under section headings, between list rows and around cards. Never a hairline plus a background change on the same boundary.

## Components

- Covers are generated from the article slug (`CoverArt`), tinted by the topic hue, so no external image host is needed. A `coverImage` URL overrides it.
- Avatars are initials on a hue-derived gradient (`AuthorAvatar`).
- Radius `0.5rem` on cards and images, full round on pills and buttons.
- Hover: cover art scales `1.03–1.05` over 700ms; text goes to `--signal`.

## Charts (admin)

Single series, single hue (`var(--signal)`), 4px rounded bar tops, `var(--rule)` horizontal grid only,
axis text in `--muted-foreground`. No legend for one series, no dual axes.
