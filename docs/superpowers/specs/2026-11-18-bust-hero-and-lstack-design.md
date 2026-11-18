# Bust hero, lstack carousel and page reorder: design

## Why

Lincoln attaches this site to job applications. It should show an engineer who knows how to work with AI, not only the products he has built. The hero should be bold and eyecatching. The rest of the page should stay light, calm and readable for people who aren't technical.

## Decided with Lincoln

### Page order

1. Hero
2. How I ship with agents
3. Experience
4. Built this way
5. GitHub
6. Skills
7. Reviews
8. Hire Lincoln

### Hero

- **The bust:** a classical white marble bust of Lincoln wearing black glasses. This is the only likeness on the site; no photo and no cartoon character.
- **Scroll animation:** as the visitor scrolls, the head turns from looking toward the name to facing the visitor. Then the glasses slide off and drop out of frame.
- **Placement:** the bust slightly overlaps the hero text to add depth, and the text stays readable.
- **Logos:** the hero logo chips become Opinion System, lstack and Cover Me.

### How I ship with agents

- A horizontal, swipeable carousel of 8 cards, not a tall list.
- Each card has a hand-drawn monoline SVG that draws itself in when the card scrolls into view, a number, a short title and one line of text.
- Navigation: arrows, a counter and dots.
- The 8 cards, as in the approved mockup:
  1. Agree first
  2. Split the work
  3. Test first
  4. Less code
  5. Fresh eyes
  6. Stay focused
  7. Show proof
  8. Learn once
- The header links to github.com/TheLinc/lstack.

### Built this way

- Cover Me and Open Room cards keep their stats, "How it's built" and "Hardest problems" sections.
- Each big demo moves behind a "See it run" button.

## Approaches considered for the bust

| Approach | Verdict |
|---|---|
| **Video frames scrubbed by scroll** | **Chosen.** One still is turned into a short image-to-video clip that starts on the still and ends facing forward without glasses. The frames are keyed off a green screen into transparent WebP frames and drawn on a canvas according to scroll position. It looks the most realistic, and transparency lets the bust overlap the text. |
| A 3D model (GLB) rotated with three.js | Rejected. AI-made 3D faces look rough up close, and it adds a large dependency. |
| A plain `<video>` scrubbed through `currentTime` | Rejected. Seeking is jerky in most browsers, and Safari has no common transparent video format. |

## Calls I made (Claude)

- **Frames:** about 48 transparent WebP frames, roughly 640px wide, preloaded after the first frame paints. The first frame is also the static fallback.
- **Reduced motion:** with `prefers-reduced-motion`, the first frame shows as a still image.
- **Scroll mapping:** no pinning. The animation runs over the first ~60% of the hero scrolling out of view.
  - The bust moves a little slower than the text (light parallax), which adds depth without taking extra scroll height.
  - Revisit this if the turn feels rushed.
- **Desktop placement:** the bust sits right of the text, in front of it, overlapping the end of the name by a small amount. A soft contact shadow sits under it.
- **Phone placement:** the bust is smaller in the top right, behind the text. The text keeps full contrast.
- **Build animation:** the hero still doesn't use the build animation; the agents start building from the next section.
- **Carousel:** native CSS scroll-snap with no carousel library. The line drawings stay inline SVG.

## Open

- What Lincoln built at Opinion System for the AI integrations, for the Experience entry. This needs a sentence or two from him.
